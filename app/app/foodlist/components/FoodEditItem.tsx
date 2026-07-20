"use client"

/*
    フードアイテムの表示
    ＜概要＞
        フードリストの一覧画面内の個々の項目を表示する。
    ＜使い方＞
        <FoodItem
            key={item.id}
            item={item}
        />

        key：フードアイテムのキーとなる値（フードアイテムのID）
        item：フードアイテム
*/

import Image from "next/image";
import type { ItemDoc2 } from "@/foodlist/lib/firestoreDoc";

type props = {
    item: ItemDoc2;
    checked: boolean;
    onToggle: (id: string) => void;
}

export default function FoodEditItem({ item, checked, onToggle }: props) {
    // 評価を★で表示
    const renderStars = (value: number) =>
        "★★★★★☆☆☆☆☆".slice(5 - value, 10 - value);

    return (
        <div
            className="
                flex
                items-center
                px-4
                gap-4
            "
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.id)}
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0"
            />

            <button
                //onClick={() => router.push(`/foodlist/detail/${item.id}`)}
                className="
                w-full                  // 横幅いっぱい
                h-[var(--item-height)]  // 高さ指定
                flex                    // 中身をflexboxレイアウトにする
                items-center            // 縦方向中央揃え
                px-1                    // 横方向パディング4px
                gap-1                   // 要素間のギャップ4px
            "
            >
                {/* 画像 */}
                {item.images?.[0]?.url ? (
                    <Image
                        src={item.images[0].url}    // 画像URL指定
                        alt={item.name}         // 読み上げ時のテキスト
                        className="
                        h-[var(--item-height)] // 画像表示の高さ指定
                        w-[var(--item-height)] // 画像表示の幅指定
                        rounded                     // 角を丸くする
                        object-cover                // アスペクト比を保って大きく表示
                    "
                        width={150}     // 画像実サイズの高さ指定（必須）
                        height={150}    // 画像実サイズの幅指定（必須）
                    />
                ) : (
                    <div
                        className="
                        h-[var(--item-height)]     // 画像表示の高さ指定
                        w-[var(--item-height)]     // 画像表示の幅指定
                        flex                            // 中身をflexboxレイアウトにする
                        items-center                    // 縦方向中央揃え
                        justify-center                  // 横方向中央揃え
                        bg-[var(--grayout-color)]       // 背景色を指定
                        rounded                         // 角を丸くする
                        leading-none                   // 改行幅を小さく
                    "
                    >
                        No<br />Image
                    </div>
                )}

                {/* テキスト部分 */}
                <div
                    className="
                    flex flex-col   // flexboxレイアウトにして縦に並べる
                "
                >
                    {/* タイトル */}
                    <div
                        className="
                        text-left   // テキスト左揃え
                    "
                    >
                        {item.name}
                    </div>

                    {/* 最後に食べた日 */}
                    {item.lastEaten && (
                        <div
                            className="
                            text-left   // テキスト左揃え
                            text-xs     // テキストサイズ小
                        "
                        >
                            最後に食べた日: {item.lastEaten}
                        </div>
                    )}

                    {/* 評価 */}
                    {item.ratings && item.ratings.length > 0 && (
                        <div
                            className="
                            flex        // 中身をflexboxレイアウトにする
                            text-left   // テキスト左揃え
                            text-xs     // テキストサイズ小
                            gap-3       // 要素間のギャップ
                        "
                        >
                            {item.ratings.map((r, i) => (
                                <div
                                    key={i}
                                    className="
                                    text-yellow-600
                                "
                                >
                                    {renderStars(r.score)}
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </button>
        </div>
    );
}
