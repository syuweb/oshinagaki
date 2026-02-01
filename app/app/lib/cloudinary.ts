/*
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result); // { result: 'ok' } が成功

    return await result;
}

type CloudinaryUploadResult = {
    secure_url: string;
    public_id: string;
};

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "oshinagaki/items" },
            (error, result) => {
                if (error || !result) {
                    reject(error);
                } else {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
            }
        ).end(buffer);
    });

    return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
    });
}
*/