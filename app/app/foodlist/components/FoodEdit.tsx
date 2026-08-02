"use client"

/*
    フードリストの編集用一覧表示
    ＜概要＞
        フードリストを編集するための一覧画面を表示する。
        個々の項目はFoodItemで表示する。
    ＜使い方＞
        <FoodList
            items={items}
        />

        items：フードアイテムの配列
*/

import FoodEditItem from "@/foodlist/components/FoodEditItem";
import type { ItemDoc2 } from "@/foodlist/lib/firestoreDoc";
import { useRouter } from "next/navigation";
import { useSetMenuItems } from "@/hooks/useMenuItems";
import { useState, useMemo, useEffect, useCallback } from "react";
import { deleteItem2 } from "@/foodlist/lib/items2";
import { useSetSubBar } from "@/hooks/useSubBar";
import { useSetBottomBar } from "@/components/BottomBar";
import { useGetCategoryList } from "@/foodlist/components/CategoryList";

type props = {
    items: ItemDoc2[];
}

export default function FoodEdit({ items }: props) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [allIds, setAllIds] = useState<string[]>([]);


    const [displayItems, setDisplayItems] = useState<ItemDoc2[]>([]);
    const [selectedId, setSelectedId] = useState<string>("すべて");

    useEffect(() => {
        const displayIds = displayItems.map((item) => item.id);
        setAllIds(displayIds);
    }, [displayItems]);

    useEffect(() => {
        const filteredItems =
            selectedId === "すべて"
                ? items
                : items.filter(item => item.categoryId === selectedId);

        const sortedItems = [...filteredItems].sort((a, b) =>
            (b.lastEaten ?? "").localeCompare(a.lastEaten ?? "")
        );

        setDisplayItems(sortedItems);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    const handleTop = useCallback(() => {
        router.push("/foodlist");
    }, [router]);

    const deleteSelectedItems = useCallback(async () => {
        if (selectedIds.length === 0) return;

        const ok = confirm(`選択した ${selectedIds.length} 件を削除しますか？`);
        if (!ok) return;

        for (const id of selectedIds) {
            const item = items.find(i => i.id === id);
            if (!item) continue;
            try {
                // 既存の削除処理を呼ぶ
                await deleteItem2(item.id);
            } catch (e) {
                console.error("削除失敗:", item.id, e);
                alert(`削除に失敗しました: ${item.name}`);
                return;
            }
        }

        /* トップ画面に移動 */
        handleTop();
    }, [selectedIds, items, handleTop]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const menuItems = useMemo(
        () => [
            {
                name: "全選択",
                onClick: () => { setSelectedIds(allIds) },
            },
            {
                name: "全選択解除",
                onClick: () => { setSelectedIds([]) },
            },
            {
                name: "削除実行",
                onClick: () => { deleteSelectedItems() },
            },
            {
                name: "戻る",
                onClick: handleBack,
            },
        ], [setSelectedIds, allIds, deleteSelectedItems, handleBack]
    );

    useSetMenuItems(menuItems);

    const categoryList = useGetCategoryList();
    const categoryAll = {
        id: "すべて",
        name: "すべて",
        order: -1,
    }
    const categoryEtc = {
        id: "",
        name: "その他",
        order: 9999,
    }
    const categories = useMemo(() => [
        categoryAll,
        ...categoryList,
        categoryEtc,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [categoryList]);

    /* サブバー設定 */
    useSetSubBar(
        <div
            className="
                    fixed
                    flex
                    gap-4
                    w-full
                "
        >
            <div className="flex overflow-x-auto whitespace-nowrap px-3 gap-0">
                {categories.map((cat) => {
                    const isActive = cat.id === selectedId;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedId(cat.id)}
                            className={`
                                min-h-[37px]
                                px-4
                                text-base
                                rounded-t-md
                                border
                                ${isActive
                                    ? "bg-white border-gray-200 border-b-white text-black z-10"
                                    : "bg-[var(--grayout-color)] border-transparent text-gray-500 mt-1"
                                }
              `}
                        >
                            {cat.name}
                        </button>
                    );
                })}
            </div>
        </div>,
        [selectedId, categoryList]
    );

    useSetBottomBar(
        <div
            className="
                    fixed
                    flex
                    px-4
                    gap-4
                    w-full
                "
        >
            <button
                type="button"
                onClick={() => setSelectedIds(allIds)}        // foodlistに戻る
                className="
                            flex-1          // 自身のwidth、またはheightのサイズを無視して伸び縮みする
                            border          // 枠表示
                            rounded         // 角を丸くする
                            py-1            // 縦方向パディング1px
                            text-base       // フォントサイズをbase(16px)に
                        "
            >
                全選択
            </button>
            <button
                type="button"
                onClick={() => setSelectedIds([])}        // foodlistに戻る
                className="
                            flex-1          // 自身のwidth、またはheightのサイズを無視して伸び縮みする
                            border          // 枠表示
                            rounded         // 角を丸くする
                            py-1            // 縦方向パディング1px
                            text-base       // フォントサイズをbase(16px)に
                        "
            >
                全選択解除
            </button>
            <button
                type="button"
                onClick={() => deleteSelectedItems()}
                className="
                            flex-1          // 自身のwidth、またはheightのサイズを無視して伸び縮みする
                            border          // 枠表示
                            rounded         // 角を丸くする
                            py-1            // 縦方向パディング1px
                            text-base       // フォントサイズをbase(16px)に
                        "
            >
                削除実行
            </button>
            <button
                type="button"
                onClick={() => router.back()}        // foodlistに戻る
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
        </div>,
        [selectedIds, allIds]
    );

    if (!items || items.length === 0) return null;

    return (
        <>
            <div
                className="
                    pb-[var(--subbar-height)]
                    flex flex-col       //flexboxレイアウトにして縦に並べる
                    gap-3               // アイテム間のギャップ
                "
            >
                {displayItems.map(item => (
                    <FoodEditItem
                        key={item.id}
                        item={item}
                        checked={selectedIds.includes(item.id)}
                        onToggle={(id) => {
                            setSelectedIds(prev =>
                                prev.includes(id)
                                    ? prev.filter(x => x !== id)
                                    : [...prev, id]
                            );
                        }}
                    />
                ))}
            </div>
        </>
    );
}