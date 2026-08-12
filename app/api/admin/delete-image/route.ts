import { NextResponse } from "next/server";
import { supabaseServer, isServerSupabaseConfigured } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { storage_path, image_url } = await req.json();

    if (!storage_path && !image_url) {
      return NextResponse.json({ error: "No image identifier provided" }, { status: 400 });
    }

    // 1. Delete from Supabase Storage if remote
    if (isServerSupabaseConfigured && supabaseServer && storage_path && !storage_path.startsWith("local/")) {
      const { error } = await supabaseServer.storage
        .from("product-images")
        .remove([storage_path]);

      if (error) {
        console.warn("Supabase storage delete warning:", error);
      }
    }

    // 2. Delete from local storage if local file
    if (image_url && image_url.startsWith("/uploads/")) {
      const localFilePath = path.join(process.cwd(), "public", image_url);
      if (fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch {
          // ignore
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Image delete error:", err);
    return NextResponse.json({ error: err?.message || "Delete failed" }, { status: 500 });
  }
}
