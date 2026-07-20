/*
    cloudinary 画像削除メソッド
    ＜概要＞
        画像データベース(cloudinary)からの画像削除(POST)
    ＜使い方＞
        画像登録：
            const res = await fetch("/foodlist/api/cloudinary/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    publicId: publicId,
                }),
            });

            res：戻り値
            publicId：削除する画像のID
*/

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    console.log('[API] upload start');

    const { publicId } = await req.json();

    if (!publicId) {
        return NextResponse.json({ error: "No publicId" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ result });
}
