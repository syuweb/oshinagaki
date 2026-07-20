/*
    cloudinaryアクセスライブラリ
    ＜概要＞
        画像データベース(cloudinary)への画像登録／削除を行う
    ＜使い方＞
        画像登録：
            const { url, publicId } = await uploadToCloudinary(imageUrl);

            url：登録後の画像へのアクセスURL（firestoreに格納）
            publicId：登録した画像のID（firestoreに格納）
            imageUrl：登録する画像のURL（登録時のみ使用）
        画像削除：
            await deletFromCloudinary(publicId);
*/

export async function uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/foodlist/api/cloudinary/upload", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Cloudinary upload failed");
    }

    return res.json();
}

export async function deleteFromCloudinary(publicId: string) {
    const res = await fetch("/foodlist/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            publicId: publicId,
        }),
    });

    if (!res.ok) {
        throw new Error("Cloudinary delete failed");
    }
}