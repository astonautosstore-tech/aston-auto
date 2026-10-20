import { NextResponse } from "next/server";
import crypto from "crypto";

// Paystack webhook listener
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // TODO: Verify HMAC SHA512 signature in production
    if (secret && signature) {
      const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
      if (hash !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody || "{}");

    // Handle charge.success
    if (event.event === "charge.success") {
      const reference = event.data?.reference;
      // TODO: Update order status from 'pending_payment' to 'paid' in Supabase
      console.log(`[Paystack Webhook] Charge succeeded for reference: ${reference}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Paystack webhook processing error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
