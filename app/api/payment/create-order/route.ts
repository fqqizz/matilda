import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live Razorpay credentials exist, create live order
    if (keyId && keySecret && !keyId.includes("XXXXXXXX")) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // convert to paise
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          payment_capture: 1,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: orderData.error?.description || "Gateway error" }, { status: 500 });
      }

      return NextResponse.json({
        id: orderData.id,
        currency: orderData.currency,
        amount: orderData.amount,
        isLive: true,
      });
    }

    // Isolated test mode order creation (safe fallback)
    const simulatedOrderId = `order_test_${Date.now()}`;
    return NextResponse.json({
      id: simulatedOrderId,
      currency: "INR",
      amount: Math.round(amount * 100),
      isLive: false,
      message: "Test mode payment order created successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
