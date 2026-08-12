import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_SECRET = process.env.ADMIN_SESSION_SECRET || "matilda_luxury_server_auth_secret_v1";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("matilda_admin_session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false });
    }

    const parts = sessionCookie.value.split(":");
    if (parts.length !== 3) {
      return NextResponse.json({ authenticated: false });
    }

    const [prefix, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (prefix !== "matilda_admin_authenticated" || isNaN(expiresAt) || Date.now() > expiresAt) {
      return NextResponse.json({ authenticated: false });
    }

    // Verify HMAC signature
    const payload = `${prefix}:${expiresAtStr}`;
    const expectedSignature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
