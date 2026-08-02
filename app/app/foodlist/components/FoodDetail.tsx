"use client"

/*
    フードアイテムの詳細表示
    ＜概要＞
        フードアイテムの詳細情報を表示する。
    ＜使い方＞
        <FoodDetail
            item={item}
        />

        item：表示するフードアイテム
*/

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSetTitle } from "@/hooks/useTitle";
import { ImageSlider } from "@/components/ImageSlider";
import { ItemDoc2 } from "@/foodlist/lib/firestoreDoc";
import { RenderDescription } from "@/components/RenderDescription";
import { useSetMenuItems } from "@/hooks/useMenuItems";
import { useSetBottomBar } from "@/components/BottomBar";
import { useSetInitialized } from "@/foodlist/components/AddNewItem";

type props = {
    item: ItemDoc2;
    category?: string;
}

export default function FoodDetail({ item, category }: props) {
    useSetTitle(item.name);    //ページタイトル

    const router = useRouter();

    const images = item.images;

    const setInitialized = useSetInitialized();

    const handlePushItem = useCallback(() => {
        setInitialized(false);
        router.push(`/foodlist/update/${item.id}`);
    }, [setInitialized, router, item.id]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const menuItems = useMemo(
        () => [
            {
                name: "情報修正",
                onClick: handlePushItem,
            },
            {
                name: "戻る",
                onClick: handleBack,
            },
        ],
        [handlePushItem, handleBack]
    );

    useSetMenuItems(menuItems);

    useSetBottomBar(
        <div
            className="
                        px-8        // 横方向パディング8px
                        flex        // 中身をflexboxレイアウトにする
                        gap-4       // 要素間のギャップ
                    "
        >
            <button
                onClick={() => {
                    setInitialized(false);
                    router.push(`/foodlist/update/${item.id}`);
                }}
                type="submit"
                className="
                            flex-1          // 自身のwidth、またはheightのサイズを無視して伸び縮みする
                            border          // 枠表示
                            rounded         // 角を丸くする
                            py-1            // 縦方向パディング1px
                            text-base       // フォントサイズをbase(16px)に
                        "
            >
                情報修正
            </button>

            <button
                type="button"
                onClick={() => router.push("/foodlist")}        // foodlistに戻る
                className="
                            flex-1          // 自身のwidth、またはheightのサイズを無視して伸び縮みする
                            border          // 枠表示
                            rounded         // 角を丸くする
                            py-1            // 縦方向パディング1px
                            text-base       // フォントサイズをbase(16px)に
                        "
            >
                戻る
            </button>
        </div>
    )

    return (
        <div
            className="
                px-4        // 横方向パディング4px
                py-1        // 縦方向のパディングを1に
            "
        >
            {/* メニュー名 */}
            <div
                className="
                        py-1        // 縦方向のパディングを1に
                    "
            >
                <label
                    className="
                            text-xl         // フォントサイズ20px
                            font-medium     // フォントの太さ(Weight)を指定(500)
                        "
                >
                    {item.name}
                </label>
            </div>

            {/* メニュー画像 */}
            <div className="py-1">
                <div
                    className="
                            px-4            // 横方向パディング4px
                            flex            // 中身をflexboxレイアウトにする
                            items-end       // 垂直方向の終端側に寄せる
                        "
                >
                    <div
                        className="
                                h-[var(--image-size)]           // 画像表示の高さ指定
                                w-[var(--image-size)]           // 画像表示の幅指定
                                flex                            // 中身をflexboxレイアウトにする
                                items-center                    // 縦方向中央揃え
                                justify-center                  // 横方向中央揃え
                                border                          // 枠表示
                                rounded                         // 角を丸くする
                                leading-none                    // 改行幅を小さく
                            "
                    >
                        {(!images || images.length === 0) ? (
                            <div>No < br /> Image</div>
                        ) : (
                            <ImageSlider
                                images={images}
                                indicator={15}
                                className="
                                    h-[var(--image-size)]     // 画像表示の高さ指定
                                    w-[var(--image-size)]     // 画像表示の幅指定
                                "
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* カテゴリー */}
            <div className="py-1">
                <label
                    className="
                            text-xl         // フォントサイズ20px
                            font-medium     // フォントの太さ(Weight)を指定(500)
                        "
                >
                    カテゴリー：{category}
                </label>
            </div>

            {/* 最後に食べた日 */}
            <div
                className="
                        py-1        // 縦方向パディング1px
                    "
            >
                <label
                    className="
                            text-xl         // フォントサイズ20px
                            font-medium     // フォントの太さ(Weight)を指定(500)
                        "
                >
                    最後に食べた日
                </label>
                <div
                    className="
                            px-4            // 横方向パディング4px
                            pr-[34px]       // 右方向パディング34px
                        "
                >
                    {item.lastEaten}
                </div>
            </div>

            {/* 評価 */}
            <div
                className="
                        py-1        // 縦方向パディング1px
                    "
            >
                <label
                    className="
                            text-xl         // フォントサイズ20px
                            font-medium     // フォントの太さ(Weight)を指定(500)
                        "
                >
                    評価
                </label>
                <div className="flex items-center justify-between px-14">
                    {item.ratings?.map((r) => (
                        <div key={r.name} className="flex items-center gap-3">
                            <span className="font-medium">{r.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between px-10">
                    {item.ratings?.map((r) => (
                        <div key={r.name} className="flex items-center">
                            {[1, 2, 3, 4, 5].map((v) => (
                                <div key={v}>{v <= r.score ? "★" : "☆"}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* 説明 */}
            <div
                className="
                        py-1        // 縦方向パディング1px
                    "
            >
                <label
                    className="
                            text-xl         // フォントサイズ20px
                            font-medium     // 右方向パディング34px
                        "
                >
                    説明
                </label>
                <div
                    className="
                            px-4            // 横方向パディング4px
                        "
                >
                    <div
                        className="
                                w-full              // 幅はメニュー幅に合わせる
                                px-2                // 横方向パディング2px
                                py-1                // 縦方向パディング1px
                                text-base           // フォントサイズをbase(16px)に
                                whitespace-pre-wrap // 改行を再現する
                            "
                    >
                        {item.description && (
                            RenderDescription(item.description)
                        )}
                    </div>
                </div>
            </div>
        </div >

    );
}
