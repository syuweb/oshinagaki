"use client"

/*
    フードリストの一覧表示
    ＜概要＞
        フードリストの一覧画面を表示する。
        個々の項目はFoodItemで表示する。
    ＜使い方＞
        <FoodList
            items={items}
        />

        items：フードアイテムの配列
*/

import { useState, useMemo, useEffect, useCallback } from "react";
import FoodItem from "@/foodlist/components/FoodItem";
import type { ItemDoc2 } from "@/foodlist/lib/firestoreDoc";
import { useSetMenuItems } from "@/hooks/useMenuItems";
import { useRouter } from "next/navigation";
import { useSetInitialized } from "@/foodlist/components/AddNewItem";
import { useSetSubBar } from "@/hooks/useSubBar";
import { useGetCategoryList } from "@/foodlist/components/CategoryList";

type props = {
    items: ItemDoc2[];
}

export default function FoodList({ items }: props) {
    const [displayItems, setDisplayItems] = useState<ItemDoc2[]>([]);
    const [selectedId, setSelectedId] = useState<string>("すべて");

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

    const router = useRouter();

    const setInitialized = useSetInitialized();

    /* プルダウン用メニューアイテムの設定 */
    const handleAdd = useCallback(() => {
        setInitialized(false);
        router.push(`/foodlist/add`);
    }, [setInitialized, router]);

    const handleEdit = useCallback(() => {
        router.push(`/foodlist/edit`);
    }, [router]);

    const handleCategory = useCallback(() => {
        router.push(`/foodlist/category`);
    }, [router]);

    const menuItems = useMemo(
        () => [
            {
                name: "アイテム追加",
                onClick: handleAdd,
            },
            {
                name: "アイテム編集",
                onClick: handleEdit,
            },
            {
                name: "カテゴリー編集",
                onClick: handleCategory,
            },
        ],
        [handleAdd, handleEdit, handleCategory]
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

    if (!displayItems || displayItems.length === 0) return null;

    return (
        <div
            className="
                flex flex-col       //flexboxレイアウトにして縦に並べる
                gap-3               // アイテム間のギャップ
            "
        >
            {displayItems.map(item => (
                <FoodItem
                    key={item.id}
                    item={item}
                />
            ))}
        </div>
    );
}