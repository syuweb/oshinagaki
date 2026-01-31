"use server";

//import { redirect } from "next/navigation";
//import { addItem, uploadToCloudinary } from "@/lib/items";
//import type { ItemDoc } from "@/lib/item";
/*
export async function addItemAction(formData: FormData) {
    const file = formData.get("image") as File;

    const uploadResult = await uploadToCloudinary(file);

    await addItem({
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        imageUrl: uploadResult.imageUrl,
        imagePublicId: uploadResult.imagePublicId,
    });

return { success: true };
    //redirect("/"); // 一覧ページ
}
*/