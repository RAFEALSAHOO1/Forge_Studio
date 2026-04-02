import { Router, type IRouter } from "express";
import { checkRateLimit } from "../lib/rateLimiter";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/submit-request", async (req, res): Promise<void> => {
  const ip = String(req.ip || req.headers["x-forwarded-for"] || "unknown");
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    res.status(429).json({ error: "rate_limit_exceeded", message: "Too many requests. Please try again later." });
    return;
  }

  const { templateId, customerName, customerEmail, customizations } = req.body;

  if (!templateId || !customerName || !customerEmail || !customizations) {
    res.status(400).json({ error: "validation_error", message: "Missing required fields." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    res.status(400).json({ error: "validation_error", message: "Invalid email address." });
    return;
  }

  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  logger.info({ requestId, templateId, customerName, customerEmail }, "Design request received");

  const resendApiKey = process.env["RESEND_API_KEY"];
  const adminEmail = process.env["ADMIN_EMAIL"];

  if (resendApiKey && adminEmail) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: "DesignForge Studio <noreply@designforge.studio>",
        to: adminEmail,
        subject: `New Design Request: ${templateId} — ${customerName}`,
        html: `
          <h2>New Design Request</h2>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p><strong>Template:</strong> ${templateId}</p>
          <p><strong>Customer:</strong> ${customerName} &lt;${customerEmail}&gt;</p>
          <h3>Customizations</h3>
          <pre>${JSON.stringify(customizations, null, 2)}</pre>
        `,
      });

      await resend.emails.send({
        from: "DesignForge Studio <noreply@designforge.studio>",
        to: customerEmail,
        subject: `Your Design Request — ${requestId}`,
        html: `
          <h2>Thank you, ${customerName}!</h2>
          <p>Your design request has been received. We'll get to work right away.</p>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p><strong>Template:</strong> ${templateId}</p>
          <p>You'll receive your design files within the promised delivery window. Reach out any time with questions.</p>
          <p>— The DesignForge Team</p>
        `,
      });
    } catch (err) {
      logger.warn({ err }, "Failed to send email — continuing without notification");
    }
  } else {
    logger.warn("RESEND_API_KEY or ADMIN_EMAIL not set — skipping email notification");
  }

  res.json({
    requestId,
    message: "Your design request has been received. We'll be in touch soon.",
    estimatedDelivery: "Within 24-72 hours depending on the template",
  });
});

export default router;
