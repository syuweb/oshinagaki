"use client";

import Link from "next/link";
import { useState } from "react";
import CategoryTabs from "@/components/CategoryTabs";
import MenuItem from "@/components/MenuItem";
import type { ItemDoc } from "@/lib/item";
import { deleteItem } from "@/lib/items"
import { useRouter } from "next/navigation";

interface MenuListProps {
  items: ItemDoc[];
}

export default function MenuList({ items }: MenuListProps) {
  // category 正規化
  const normalizeCategory = (category?: string) =>
    category && category.trim() !== "" ? category : "その他";

  const categories = [
    "全件",
    ...Array.from(
      new Set(items.map(item => normalizeCategory(item.category)))
    ),
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredItems =
    selectedCategory === "全件"
      ? items
      : items.filter(
        item => normalizeCategory(item.category) === selectedCategory
      );

  const sortedItems = [...filteredItems].sort((a, b) =>
    (b.lastEaten ?? "").localeCompare(a.lastEaten ?? "")
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  const router = useRouter();

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const ok = confirm(`選択した ${selectedIds.length} 件を削除しますか？`);
    if (!ok) return;

    for (const id of selectedIds) {
      const item = items.find(i => i.id === id);
      if (!item) continue;

      try {
        // 既存の削除処理を呼ぶ
        await deleteItem(item.id);
      } catch (e) {
        console.error("削除失敗:", item.id, e);
        alert(`削除に失敗しました: ${item.name}`);
        return;
      }
    }

    setSelectedIds([]);
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Link href="/items/add">
          <button className="px-3 py-2 text-sm rounded bg-blue-500 text-white">
            追加
          </button>
        </Link>

        <button
          disabled={selectedIds.length === 0}
          onClick={handleDeleteSelected}
          className="px-3 py-2 text-sm rounded bg-red-500 text-white disabled:opacity-40"
        >

          選択した {selectedIds.length} 件を削除
        </button>
      </div>

      <div className="mb-4">
        <CategoryTabs
          categories={categories.map(cat => {
            const count =
              cat === "全件"
                ? items.length
                : items.filter(
                  i => normalizeCategory(i.category) === cat
                ).length;

            return {
              label: `${cat} (${count})`,
              value: cat,
            };
          })}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <div className="space-y-2">
        {sortedItems.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            checked={selectedIds.includes(item.id)}
            onToggle={toggleSelect}
          />
          //<MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}