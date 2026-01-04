// app/components/MenuDetail.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

interface MenuItemProps {
    item: {
        id: string;
        name: string;
        category: string;
        description: string;
        image: string;
        lastEaten?: string;
        ratings?: { name: string; score: number }[];
    };
}

export default function MenuDetail({ item }: MenuItemProps) {
    return <div>
        <header>
            <Link href="/">← 一覧に戻る</Link>
        </header>
        <main>
            {/* 画像 */}
            <Image
                src={item.image}
                alt={item.name}
                className="w-full aspect-[4/3] object-cover rounded-lg"
                width={150} height={150}
            />

            {/* 基本情報 */}
            <div>
                <h1 className="text-xl font-bold">{item.name}</h1>
                <p className="text-sm text-gray-500">{item.category}</p>
            </div>

            {/* 最後に食べた日 */}
            {item.lastEaten && (
                <div className="text-sm text-gray-500">
                    <span className="font-medium">最後に食べた日：</span>
                    {item.lastEaten}
                </div>
            )}

            {/* 評価 */}
            <div className="p-4 space-y-2">
                <p className="font-semibold">評価</p>
                <ul className="space-y-1">
                    {item.ratings?.map((r, i) => (
                        <li key={i}>
                            {r.name}: ⭐{r.score}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 説明 */}
            <p className="leading-relaxed">{item.description}</p>
        </main>
    </div>;
}