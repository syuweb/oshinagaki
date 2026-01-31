"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

//export default cloudinary;

export async function deleteFromCloudinary(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result); // { result: 'ok' } が成功

    return await result;
}