import { Router, type Request, type Response } from "express";
import Stripe from "stripe";
import { db } from "../db/connection";
import { ordersTable, transactionsTable } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Create payment intent
router.post("/create-intent", async (req: Request, res: Response) => {
  try {
    const { amount, orderId, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId,
        ...metadata,
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Confirm payment
router.post("/confirm", async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update order status
      const order = await db.query.ordersTable.findFirst({
        where: (table) => eq(table.orderId, orderId),
      });

      if (order) {
        // Calculate processing fee (typically 2.9% + $0.30)
        const amount = parseFloat(order.totalAmount as string);
        const processingFee = amount * 0.029 + 0.3;
        const netAmount = amount - processingFee;

        // Record transaction
        await db.insert(transactionsTable).values({
          orderId: order.id,
          userId: order.userId,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          stripePaymentIntentId: paymentIntentId,
          amount: order.totalAmount as any,
          processingFee: processingFee.toString(),
          netAmount: netAmount.toString(),
          status: "completed",
          paymentMethod: "stripe",
          metadata: JSON.stringify({
            stripeIntentId: paymentIntentId,
            currency: paymentIntent.currency,
          }),
        });

        // Update order status
        await db
          .update(ordersTable)
          .set({
            paymentStatus: "completed",
            orderStatus: "confirmed",
          })
          .where(eq(ordersTable.id, order.id));
      }

      return res.json({
        success: true,
        status: "succeeded",
      });
    }

    return res.json({
      success: false,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return res.status(500).json({ error: "Failed to confirm payment" });
  }
});

// Webhook for payment updates
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    const event = req.body;

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("Payment succeeded:", event.data.object);
        // Update transaction status if needed
        break;
      case "payment_intent.payment_failed":
        console.log("Payment failed:", event.data.object);
        // Update transaction status to failed
        const failedPI = event.data.object;
        const failedOrdId = failedPI.metadata?.orderId;
        if (failedOrdId) {
          const failedOrder = await db.query.ordersTable.findFirst({
            where: (table) => eq(table.orderId, failedOrdId),
          });
          if (failedOrder) {
            // Record failed transaction
            await db.insert(transactionsTable).values({
              orderId: failedOrder.id,
              userId: failedOrder.userId,
              transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              stripePaymentIntentId: failedPI.id,
              amount: failedOrder.totalAmount as any,
              processingFee: "0",
              netAmount: "0",
              status: "failed",
              paymentMethod: "stripe",
              metadata: JSON.stringify({ reason: "payment_failed" }),
            });
          }
        }
        break;
      case "charge.refunded":
        console.log("Charge refunded:", event.data.object);
        // Handle refunds
        const refundCharge = event.data.object;
        const refundAmount = refundCharge.amount_refunded;
        if (refundCharge.payment_intent) {
          // Update transaction as refunded
          const txns = await db.query.transactionsTable.findMany({
            where: (table) =>
              eq(table.stripePaymentIntentId, refundCharge.payment_intent),
          });
          if (txns.length > 0) {
            const txn = txns[0];
            await db
              .update(transactionsTable)
              .set({
                isRefunded: true,
                refundAmount: (refundAmount / 100).toString(),
                status: "refunded",
              })
              .where(eq(transactionsTable.id, txn.id));
          }
        }
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(400).json({ error: "Webhook processing failed" });
  }
});

// Get payment methods (last 4)
router.post("/payment-methods", async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    res.json(
      paymentMethods.data.map((method) => ({
        id: method.id,
        last4: (method.card as any)?.last4,
        brand: (method.card as any)?.brand,
        expMonth: (method.card as any)?.exp_month,
        expYear: (method.card as any)?.exp_year,
      })),
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payment methods" });
  }
});

export default router;
