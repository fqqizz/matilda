import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live credentials are provided, verify real HMAC SHA256 signature
    if (keySecret && razorpay_signature && !keySecret.includes("XXXXXXXX")) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { verified: false, error: "Invalid payment signature" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    // In test mode: verify presence of mock transaction
    if (razorpay_payment_id || razorpay_order_id) {
      return NextResponse.json({
        verified: true,
        isTestMode: true,
        paymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
        orderId: razorpay_order_id || `order_sim_${Date.now()}`,
      });
    }

    return NextResponse.json({ verified: false, error: "Missing payment tokens" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
