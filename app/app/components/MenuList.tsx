// app/components/MenuList.tsx
"use client";

import { useState } from "react";
import CategoryTabs from "./CategoryTabs";
//import { menuItems } from "../data/menu";
import MenuItem from "./MenuItem";

type Item = {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    lastEaten?: string;
    ratings?: { name: string; score: number }[];
};

interface MenuListProps {
    items: Item[];
}

export default function MenuList({ items }: MenuListProps) {
    const categories = ["全件", ...Array.from(new Set(items.map(item => item.category)))];

    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    const filteredItems =
        selectedCategory === "全件"
            ? items
            : items.filter(item => item.category === selectedCategory);

    const sortedItems = [...filteredItems].sort((a, b) =>
        (b.lastEaten ?? '').localeCompare(a.lastEaten ?? '')
    );
    return (
        <div>
            <div className="mb-4">
                <CategoryTabs
                    categories={categories.map(cat => {
                        const count = cat === "全件"
                            ? items.length
                            : items.filter(i => i.category === cat).length;
                        return { label: `${cat} (${count})`, value: cat }; // label: 表示、value: 判定用
                    })}
                    selected={selectedCategory}
                    onChange={(cat) => setSelectedCategory(cat)}
                />
            </div>
            <div className="space-y-2">
                {sortedItems.map(item => (
                    <MenuItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}