import { Resend } from "resend";
import { logger } from "./logger";

function getResend() {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

interface OrderConfirmationParams {
  to: string;
  customerName: string;
  orderId: string;
  templateId: string;
  amount: number;
  currency: string;
  deliveryTime: string;
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationParams): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("RESEND_API_KEY not set — skipping order confirmation email");
    return;
  }

  const currencySymbol = params.currency === "INR" ? "₹" : params.currency === "USD" ? "$" : params.currency === "GBP" ? "£" : params.currency;

  try {
    await resend.emails.send({
      from: "DesignForge Studio <noreply@designforge.studio>",
      to: params.to,
      subject: `Order Confirmed — ${params.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>
          body { font-family: Inter, sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 800; }
          .body { padding: 40px; }
          .badge { display: inline-block; background: rgba(124,58,237,0.2); color: #a78bfa; border: 1px solid rgba(124,58,237,0.3); border-radius: 999px; padding: 4px 16px; font-size: 14px; margin-bottom: 24px; }
          .detail { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .detail-row:last-child { border: none; }
          .label { color: #9ca3af; font-size: 14px; }
          .value { color: #e5e7eb; font-weight: 500; }
          .amount { font-size: 24px; font-weight: 700; color: #a78bfa; }
          .footer { text-align: center; padding: 24px; color: #6b7280; font-size: 13px; }
          .cta { display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0; }
        </style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DesignForge Studio</h1>
              <p style="color:rgba(255,255,255,0.7);margin:8px 0 0">Your design is being crafted</p>
            </div>
            <div class="body">
              <span class="badge">Order Confirmed</span>
              <h2 style="margin:0 0 24px;font-size:22px">Thank you, ${params.customerName}!</h2>
              <div class="detail">
                <div class="detail-row">
                  <span class="label">Order ID</span>
                  <span class="value">${params.orderId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Template</span>
                  <span class="value">${params.templateId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Amount Paid</span>
                  <span class="value amount">${currencySymbol}${params.amount}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Est. Delivery</span>
                  <span class="value">${params.deliveryTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status</span>
                  <span class="value" style="color:#34d399">In Progress</span>
                </div>
              </div>
              <p style="color:#9ca3af;line-height:1.6">
                Our designers are now working on your bespoke design. You'll receive updates as your project progresses.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 DesignForge Studio. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    logger.warn({ err }, "Failed to send order confirmation email");
  }
}

export async function sendAdminOrderNotification(params: OrderConfirmationParams & { customizations: object }): Promise<void> {
  const resend = getResend();
  const adminEmail = process.env["ADMIN_EMAIL"];
  if (!resend || !adminEmail) return;

  try {
    await resend.emails.send({
      from: "DesignForge Studio <noreply@designforge.studio>",
      to: adminEmail,
      subject: `New Order: ${params.orderId}`,
      html: `
        <h2>New Design Order</h2>
        <p><strong>Order ID:</strong> ${params.orderId}</p>
        <p><strong>Customer:</strong> ${params.customerName} (${params.to})</p>
        <p><strong>Template:</strong> ${params.templateId}</p>
        <p><strong>Amount:</strong> ${params.amount} ${params.currency}</p>
        <h3>Customizations:</h3>
        <pre>${JSON.stringify(params.customizations, null, 2)}</pre>
      `,
    });
  } catch (err) {
    logger.warn({ err }, "Failed to send admin notification");
  }
}
