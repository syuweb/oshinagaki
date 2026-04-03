// Foodlistの一覧表示

import FoodItem from "./FoodItem";
import type { ItemDoc } from "@/lib/item";

type props = {
    items: ItemDoc[];
}

export default function FoodList({ items }: props) {
    if (!items || items.length === 0) return null;

    return (
        <div
            className="
                flex flex-col       //flexboxレイアウトにして縦に並べる
                gap-3               // アイテム間のギャップ
            "
        >
            {items.map(item => (
                <FoodItem key={item.id} item={item} />
            ))}
        </div>
    );
}