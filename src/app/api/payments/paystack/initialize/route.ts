import { NextResponse } from "next/server";
import { paymentProvider } from "@/lib/payments/paystack";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, email, amountInNaira, customerName } = body;

    if (!orderNumber || !email || !amountInNaira) {
      return NextResponse.json(
        { error: "Missing required transaction fields" },
        { status: 400 }
      );
    }

    const result = await paymentProvider.initializeTransaction({
      orderNumber,
      email,
      amountInNaira,
      customerName,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/order-success/${orderNumber}`,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return NextResponse.json(
      { error: "Internal payment provider initialization error" },
      { status: 500 }
    );
  }
}
