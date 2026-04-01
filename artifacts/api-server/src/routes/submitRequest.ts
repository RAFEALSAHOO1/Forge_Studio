import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import {
  SubmitDesignRequestBody,
  SubmitDesignRequestResponse,
} from "@workspace/api-zod";
import { mockTemplates } from "../data/templates";
import { checkRateLimit } from "../lib/rateLimiter";

const router: IRouter = Router();

router.post("/submit-request", async (req, res): Promise<void> => {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    res.status(429).json({
      error: "rate_limit_exceeded",
      message: `Too many requests. Please try again in ${rateCheck.retryAfter} seconds.`,
    });
    return;
  }

  const parsed = SubmitDesignRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "invalid_request",
      message: parsed.error.message,
    });
    return;
  }

  const { templateId, customerEmail, customerName, customizations, notes } =
    parsed.data;

  const template = mockTemplates.find((t) => t.id === templateId);
  if (!template) {
    res.status(400).json({
      error: "invalid_template",
      message: "Template not found. Please select a valid template.",
    });
    return;
  }

  const sanitizedCustomizations = {
    texts: Object.fromEntries(
      Object.entries(customizations.texts).map(([k, v]) => [
        k,
        String(v).trim().slice(0, 200),
      ])
    ),
    colors: Object.fromEntries(
      Object.entries(customizations.colors).map(([k, v]) => [
        k,
        /^#[0-9A-Fa-f]{3,8}$/.test(String(v)) ? String(v) : "#000000",
      ])
    ),
    fonts: Object.fromEntries(
      Object.entries(customizations.fonts).map(([k, v]) => [
        k,
        template.availableFonts.includes(String(v))
          ? String(v)
          : template.availableFonts[0],
      ])
    ),
  };

  const requestId = randomUUID();
  const estimatedDelivery = template.deliveryTime;

  req.log.info(
    { requestId, templateId, customerEmail: customerEmail.replace(/(.{2}).*@/, "$1***@") },
    "Design request submitted"
  );

  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@designforge.studio";

  if (resendApiKey) {
    const emailPromise = sendEmails({
      resendApiKey,
      adminEmail,
      customerEmail,
      customerName,
      requestId,
      templateTitle: template.title,
      estimatedDelivery,
      customizations: sanitizedCustomizations,
      notes: notes ? String(notes).trim().slice(0, 500) : undefined,
    });
    emailPromise.catch((err: unknown) => {
      req.log.error({ err, requestId }, "Failed to send emails");
    });
  } else {
    req.log.warn({ requestId }, "RESEND_API_KEY not set — skipping email send");
  }

  res.json(
    SubmitDesignRequestResponse.parse({
      success: true,
      requestId,
      message: `Your design request has been received. We'll deliver your ${template.title} within ${estimatedDelivery}.`,
      estimatedDelivery,
    })
  );
});

async function sendEmails(opts: {
  resendApiKey: string;
  adminEmail: string;
  customerEmail: string;
  customerName: string;
  requestId: string;
  templateTitle: string;
  estimatedDelivery: string;
  customizations: { texts: Record<string, string>; colors: Record<string, string>; fonts: Record<string, string> };
  notes?: string;
}) {
  const {
    resendApiKey,
    adminEmail,
    customerEmail,
    customerName,
    requestId,
    templateTitle,
    estimatedDelivery,
    customizations,
    notes,
  } = opts;

  const customizationSummary = [
    ...Object.entries(customizations.texts).map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`),
    ...Object.entries(customizations.colors).map(([k, v]) => `<tr><td><strong>${k}</strong></td><td><span style="background:${v};padding:2px 8px;border-radius:3px;">&nbsp;</span> ${v}</td></tr>`),
    ...Object.entries(customizations.fonts).map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`),
  ].join("");

  const adminHtml = `
    <h2>New Design Request — ${templateTitle}</h2>
    <p><strong>Request ID:</strong> ${requestId}</p>
    <p><strong>Customer:</strong> ${customerName} &lt;${customerEmail}&gt;</p>
    <p><strong>Template:</strong> ${templateTitle}</p>
    <p><strong>Delivery:</strong> ${estimatedDelivery}</p>
    ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
    <h3>Customizations</h3>
    <table border="1" cellpadding="6" cellspacing="0">${customizationSummary}</table>
  `;

  const customerHtml = `
    <h2>Your Design Request is Confirmed</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for choosing DesignForge Studio. We've received your request for <strong>${templateTitle}</strong> and our designers are on it.</p>
    <p><strong>Request ID:</strong> ${requestId}</p>
    <p><strong>Expected Delivery:</strong> ${estimatedDelivery}</p>
    <p>We'll reach out as soon as your design is ready. If you have any questions, simply reply to this email.</p>
    <p>— The DesignForge Studio Team</p>
  `;

  const headers = {
    Authorization: `Bearer ${resendApiKey}`,
    "Content-Type": "application/json",
  };

  let attempt = 0;
  while (attempt < 3) {
    attempt++;
    try {
      await Promise.all([
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: "DesignForge Studio <noreply@designforge.studio>",
            to: [adminEmail],
            subject: `New Request: ${templateTitle} — ${requestId}`,
            html: adminHtml,
          }),
        }),
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: "DesignForge Studio <noreply@designforge.studio>",
            to: [customerEmail],
            subject: `Design Request Confirmed — ${requestId}`,
            html: customerHtml,
          }),
        }),
      ]);
      return;
    } catch (err) {
      if (attempt >= 3) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

export default router;
