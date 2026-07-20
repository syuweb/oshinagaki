"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(url: string) {
    try {
        const result = await cloudinary.uploader.upload(url, {
            folder: "oshinagaki/foodlist",
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}
