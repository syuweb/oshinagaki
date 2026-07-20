/*
    cloudinary 画像登録メソッド
    ＜概要＞
        画像データベース(cloudinary)への画像登録(POST)
    ＜使い方＞
        画像登録：
            const res = await fetch("/foodlist/api/cloudinary/upload", {
                method: "POST",
                body: formData,
            });

            res：戻り値（return res.json();）
                url：登録後の画像へのアクセスURL（firestoreに格納）
                publicId：登録した画像のID（firestoreに格納）
            formData：登録する画像URL
*/

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
    console.log("cloudinary env", {
        name: !!process.env.CLOUDINARY_CLOUD_NAME,
        key: !!process.env.CLOUDINARY_API_KEY,
        secret: !!process.env.CLOUDINARY_API_SECRET,
    });
    console.log('[API] upload start');

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "oshinagaki/foodlist" },
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
