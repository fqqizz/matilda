import { NextResponse } from "next/server";
import { supabaseServer, isServerSupabaseConfigured } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const storagePath = `${folder}/${Date.now()}-${cleanFileName}`;

    // If Supabase Storage is live and configured, upload directly to bucket
    if (isServerSupabaseConfigured && supabaseServer) {
      const { data, error } = await supabaseServer.storage
        .from("product-images")
        .upload(storagePath, buffer, {
          contentType: file.type || "image/webp",
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        // Fallback to local storage if bucket is not created yet
      } else {
        const { data: publicUrlData } = supabaseServer.storage
          .from("product-images")
          .getPublicUrl(storagePath);

        return NextResponse.json({
          success: true,
          url: publicUrlData.publicUrl,
          storage_path: storagePath,
          isRemote: true,
        });
      }
    }

    // Local file storage fallback (for development / local mode)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const localFileName = `${Date.now()}-${cleanFileName}`;
    const localFilePath = path.join(uploadsDir, localFileName);
    fs.writeFileSync(localFilePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${localFileName}`,
      storage_path: `local/${localFileName}`,
      isRemote: false,
    });
  } catch (err: any) {
    console.error("Image upload error:", err);
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
