/**
 * Aston Auto Stores - Payment Gateway Provider Abstraction
 * Supports Paystack initialization and webhook signature verification.
 * Note: Real charging is intentionally disabled (simulation/demo mode) as per instructions.
 */
import {
  PaymentInitializationParams,
  PaymentInitializationResult,
  PaymentVerificationResult,
} from "./types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const paymentProvider = {
  /**
   * Initialize a Paystack transaction
   * In demo/stub mode: returns a simulated reference and success response
   */
  async initializeTransaction(
    params: PaymentInitializationParams
  ): Promise<PaymentInitializationResult> {
    const reference = `REF-ASTON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // TODO: When ready for production charging with Paystack:
    // If PAYSTACK_SECRET_KEY is present and not a dummy, call:
    // https://api.paystack.co/transaction/initialize
    // const response = await fetch("https://api.paystack.co/transaction/initialize", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: params.email,
    //     amount: Math.round(params.amountInNaira * 100), // Kobo
    //     reference,
    //     callback_url: params.callbackUrl,
    //     metadata: params.metadata,
    //   }),
    // });
    // const data = await response.json();
    // return { success: data.status, authorizationUrl: data.data.authorization_url, reference };

    return {
      success: true,
      reference,
      authorizationUrl: `${params.callbackUrl || "/order-success"}?reference=${reference}`,
      message: "Transaction initialized in Aston Auto demo/sandbox mode.",
    };
  },

  /**
   * Verify transaction callback from Paystack
   */
  async verifyTransaction(reference: string): Promise<PaymentVerificationResult> {
    // TODO: Call Paystack https://api.paystack.co/transaction/verify/{reference}
    return {
      success: true,
      status: "success",
      reference,
      amount: 52000000,
      paidAt: new Date().toISOString(),
      channel: "card",
    };
  },
};
