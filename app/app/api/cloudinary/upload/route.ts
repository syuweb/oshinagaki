export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "oshinagaki/items" },
      (error: unknown, result?: CloudinaryUploadResult) => {
        console.log("cloudinary callback", { error, result });
        if (error || !result) {
          reject(error);
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    ).end(buffer);
  });

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
  });
}
