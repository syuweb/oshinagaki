"use client";

import Image from "next/image";
import Link from "next/link";
import type { ItemDoc, Rating, RatingName } from "@/lib/item";
import { RATING_NAMES } from "@/lib/item";
import { useState } from "react";
import { saveRating, uploadToCloudinary } from "@/lib/items";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { useRouter } from "next/navigation";

interface MenuItemProps {
    item: ItemDoc;
}

export default function MenuDetail({ item }: MenuItemProps) {
    /*
    const [score, setScore] = useState(
        item.ratings?.[0]?.score ?? 0
    );
    */
    /*
        const ratings: Rating[] = RATING_NAMES.map((name) => {
            const existing = item.ratings?.find(r => r.name === name);
            return {
                name,
                score: existing?.score ?? 0,
            };
        });
    */
    const [lastEaten, setLastEaten] = useState<string | undefined>(
        item.lastEaten
    );

    const handleLastEatenChange = async (value: string) => {
        setLastEaten(value);

        const ref = doc(db, "items", item.id);
        await updateDoc(ref, {
            lastEaten: value || undefined,
        });
    };

    const [ratings, setRatings] = useState<Rating[]>(() =>
        RATING_NAMES.map((name) => {
            const existing = item.ratings?.find((r) => r.name === name);
            return {
                name,
                score: existing?.score ?? 0,
            };
        })
    );

    const handleRatingChange = async (
        name: RatingName,
        score: number
    ) => {
        const nextRatings = ratings.map((r) =>
            r.name === name ? { ...r, score } : r
        );

        // ① 画面更新（即反映）
        setRatings(nextRatings);

        // ② Firestore 保存
        await saveRating(item.id, nextRatings, name, score);
    };

    const [name, setName] = useState(item.name);
    const [category, setCategory] = useState(item.category ?? "");
    const [description, setDescription] = useState(item.description ?? "");

    const updateItem = async (data: Partial<ItemDoc>) => {
        const ref = doc(db, "items", item.id);
        await updateDoc(ref, data);
    };

    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (item.image?.publicId) {
            await deleteFromCloudinary(item.image.publicId);
        }

        const { imageUrl, imagePublicId } = await uploadToCloudinary(file);

        await updateItem({
            image: {
                url: imageUrl,
                publicId: imagePublicId,
            },
        });

        router.refresh();
    }

    const router = useRouter();

    return <div>
        <header>
            <Link href="/">← 一覧に戻る</Link>
        </header>
        <main>
            {/* 画像 */}
            {item.image?.url && (
                <Image
                    src={item.image.url}
                    alt={item.name}
                    className="w-full aspect-[4/3] object-contain bg-gray-100 rounded"
                    width={150} height={150}
                />
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />

            {/* 基本情報 */}
            <div className="space-y-1">
                <label className="text-sm font-medium">名前</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => {
                        if (name.trim()) {
                            updateItem({ name: name.trim() });
                        }
                    }}
                    className="w-full border rounded px-2 py-1 text-sm"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">カテゴリー</label>
                <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onBlur={() =>
                        updateItem({
                            category: category.trim() || undefined,
                        })
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                />
            </div>

            {/* 最後に食べた日 */}
            <div className="space-y-1">
                <label className="text-sm font-medium">最後に食べた日</label>
                <input
                    type="date"
                    value={lastEaten ?? ""}
                    onChange={(e) => handleLastEatenChange(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                />
            </div>

            {/* 評価 */}
            <div className="p-4 space-y-2">
                <p className="font-semibold">評価</p>

                <div className="flex-column items-center gap-3">
                    {ratings.map((r) => (
                        <div key={r.name} className="flex items-center gap-3">
                            <span className="font-medium">{r.name}</span>

                            <StarRating
                                score={r.score}
                                onChange={(v) => handleRatingChange(r.name, v)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 説明 */}
            <div className="space-y-1">
                <label className="text-sm font-medium">説明</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() =>
                        updateItem({
                            description: description.trim() || undefined,
                        })
                    }
                    rows={3}
                    className="w-full border rounded px-2 py-1 text-sm"
                />
            </div>
        </main>
    </div>;
}

type StarRatingProps = {
    score: number;
    onChange: (value: number) => void;
};

export function StarRating({ score, onChange }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
                <button
                    key={v}
                    onClick={() => onChange(v)}
                >
                    {v <= score ? "★" : "☆"}
                </button>
            ))}
        </div>
    );
}

/*
function StarRating({
    score,
    onChange,
}: {
    score: number;
    onChange: (v: number) => void;
}) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
                <button
                    key={v}
                    type="button"
                    onClick={() => onChange(v)}
                    className="text-2xl"
                >
                    {v <= score ? "★" : "☆"}
                </button>
            ))}
        </div>
    );
}
    */