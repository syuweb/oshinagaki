"use client";

//import { addItemAction } from "@/lib/actions";
import { addItem } from "@/lib/items"
import { useRouter } from "next/navigation";
import type { ItemDoc } from "@/lib/item";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/items";

export const dynamic = "force-dynamic";

export default function AddItemPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = (formData.get("name") as string)?.trim();

        if (!name) {
            setError("名前は必須です");
            return;
        }

        const item: Partial<ItemDoc> = { name };

        const category = formData.get("category") as string;
        if (category && category.trim() !== "") {
            item.category = category;
        }

        const description = formData.get("description") as string;
        if (description && description.trim() !== "") {
            item.description = description;
        }

        const file = formData.get("image") as File | null;
        if (file && file.size > 0) {
            const { url, publicId } = await uploadToCloudinary(file);
            item.image = {
                url: url,
                publicId: publicId,
            };
        }

        await addItem(item as Omit<ItemDoc, "id">);
        router.push("/");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto px-4 space-y-6"
        >
            {/* エラー */}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {/* 名前 */}
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    名前 <span className="text-red-500">*</span>
                </label>
                <input
                    name="name"
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="例：ラーメン"
                />
            </div>

            {/* カテゴリー */}
            <div className="space-y-1">
                <label className="text-sm font-medium">カテゴリー</label>
                <input
                    name="category"
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="例：麺類"
                />
            </div>

            {/* 説明 */}
            <div className="space-y-1">
                <label className="text-sm font-medium">説明</label>
                <textarea
                    name="description"
                    rows={3}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="メモなど"
                />
            </div>

            {/* 画像 */}
            <div className="space-y-1">
                <label className="text-sm font-medium">画像</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="text-sm"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                            setPreviewUrl(null);
                            return;
                        }
                        setPreviewUrl(URL.createObjectURL(file));
                    }}
                />
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="w-full aspect-[4/3] object-contain bg-gray-100 rounded"
                    />
                )}
            </div>

            {/* ボタン */}
            <div className="pt-4 flex gap-3">
                <button
                    type="submit"
                    className="flex-1 border rounded py-2 text-sm"
                >
                    追加
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="flex-1 border rounded py-2 text-sm"
                >
                    キャンセル
                </button>
            </div>
        </form>
    );
}