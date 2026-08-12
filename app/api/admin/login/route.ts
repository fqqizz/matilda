import { NextResponse } from "next/server";
import crypto from "crypto";

// Server-side secret key for HMAC token signing (never exposed to client)
const AUTH_SECRET = process.env.ADMIN_SESSION_SECRET || "matilda_luxury_server_auth_secret_v1";

// Server-side expected admin credential
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Duha@matilda12";

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ success: false, error: "Password required" }, { status: 400 });
    }

    // Verify password securely server-side using timing-safe comparison
    const isMatch = timingSafeEqual(password.trim(), ADMIN_PASSWORD.trim());

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid admin credential" },
        { status: 401 }
      );
    }

    // Generate signed HMAC token with expiration (7 days)
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const payload = `matilda_admin_authenticated:${expiresAt}`;
    const signature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
    const sessionToken = `${payload}:${signature}`;

    const response = NextResponse.json({ success: true });

    // Set secure, httpOnly cookie for session
    response.cookies.set({
      name: "matilda_admin_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
