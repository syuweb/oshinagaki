"use client";

//import { addItemAction } from "@/lib/actions";
import { addItem } from "@/lib/items"
import { useRouter } from "next/navigation";
import type { ItemDoc } from "@/lib/item";
import { useState, useEffect } from "react";
import { uploadToCloudinary } from "@/lib/items";
import AppContainer from "@/components/AppContainer"
import { CategorySelect } from "@/components/CategorySelect"
import { getItems } from "@/lib/items";

//const items = await getItems();

export const dynamic = "force-dynamic";

export default function AddItemPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [existingCategories, setExistingCategories] = useState<string[]>([]);
    const today = new Date().toISOString().split("T")[0];
    const [lastEaten, setLastEaten] = useState(
        new Date().toISOString().split("T")[0]
    );

    useEffect(() => {
        getItems().then((items) => {
            const cats = Array.from(
                new Set(
                    items
                        .map(i => i.category)
                        .filter((c): c is string =>
                            typeof c === "string" && c.length > 0
                        )
                )
            );
            setExistingCategories(cats);
        });
    }, []);

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

        if (category.trim() !== "") {
            item.category = category;
        }

        /*
        const category = formData.get("category") as string;
        if (category && category.trim() !== "") {
            item.category = category;
        }
            */

        if (lastEaten) {
            item.lastEaten = lastEaten;
        }

        const description = formData.get("description") as string;
        if (description && description.trim() !== "") {
            item.description = description;
        }

        const file = formData.get("image") as File | null;
        if (file && file.size > 0) {
            console.log('[API] before uploadToCloudinary');
            const { url, publicId } = await uploadToCloudinary(file);
            console.log('[API] after uploadToCloudinary');
            item.image = {
                url: url,
                publicId: publicId,
            };
        }

        await addItem(item as Omit<ItemDoc, "id">);
        router.push("/");
    }

    const [category, setCategory] = useState("");

    /*
    const existingCategories = Array.from(

        new Set(
            items
                .map(i => i.category)
                .filter((c): c is string => typeof c === "string" && c.length > 0)
        )
    );
    */

    return (
        <AppContainer>
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
                <label className="text-sm font-medium">
                    カテゴリー
                </label>
                <CategorySelect
                    value={category}
                    onChange={setCategory}
                    existingCategories={existingCategories}
                />
                {/*<div className="space-y-1">
                    <label className="text-sm font-medium">カテゴリー</label>
                    <input
                        name="category"
                        className="w-full border rounded px-3 py-2 text-sm"
                        placeholder="例：麺類"
                    />
                </div>*/}

                {/* 最後に食べた日 */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">
                        最後に食べた日
                    </label>
                    <input
                        type="date"
                        value={lastEaten}
                        onChange={(e) => setLastEaten(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
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
                        className="flex-1 border rounded py-2 text-sm min-h-[44px]"
                    >
                        追加
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="flex-1 border rounded py-2 text-sm min-h-[44px]"
                    >
                        キャンセル
                    </button>
                </div>
            </form>
        </AppContainer>
    );
}