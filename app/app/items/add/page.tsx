"use client";

//import { addItemAction } from "@/lib/actions";
import { addItem, uploadToCloudinary } from "@/lib/items"

export default function AddItemPage() {
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const file = formData.get("image") as File;
        const imageUrl = await uploadToCloudinary(file);

        await addItem({
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            description: formData.get("description") as string,
            image: imageUrl,
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" />
            <input name="category" />
            <textarea name="description" />
            <input type="file" name="image" accept="image/*" />
            <button type="submit">add</button>
        </form>
    );
}