// app/components/MenuItem.tsx
"use client";

import Image from "next/image";
//import Link from "next/link";
import type { ItemDoc } from "@/lib/item";
import { deleteItem } from "@/lib/items";
import { useRouter } from "next/navigation";

//interface MenuItemProps {
//    item: ItemDoc;
//}

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("本当に削除しますか？")) return;

    await deleteItem(id);
    router.refresh();
  }

  return <button onClick={handleDelete} className="min-h-[44px]">削除</button>;
}

type Props = {
  item: ItemDoc;
  checked: boolean;
  onToggle: (id: string) => void;
  isEditing: boolean;
};

export default function MenuItem({ item, checked, onToggle, isEditing }: Props) {
  const router = useRouter();

  const renderStars = (value: number) =>
    "★★★★★☆☆☆☆☆".slice(5 - value, 10 - value);

  return (
    <button
      type="button"
      onClick={() => {
        if (isEditing) {
          onToggle(item.id);
        } else {
          router.push(`/menu/${item.id}`);
        }
      }}
      className="
      w-full
      flex items-center gap-3
      px-3 py-2
      min-h-[44px]
      text-left
      active:bg-gray-100
    "
    >
      {/* チェックボックス（編集時のみ） */}
      {isEditing && (
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(item.id)}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0"
        />
      )}

      {/* 画像 */}
      {item.image?.url ? (
        <Image
          src={item.image.url}
          alt={item.name}
          className="w-14 h-14 rounded object-cover flex-shrink-0"
          width={150}
          height={150}
        />
      ) : (
        <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
          No Image
        </div>
      )}

      {/* テキスト */}
      <div className="flex-1">
        <p className="font-medium text-sm">{item.name}</p>

        {/* 評価（一覧用） */}
        {item.ratings && item.ratings.length > 0 && (
          <div className="flex gap-4 mt-1">
            {item.ratings.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-1 text-xs text-yellow-600 leading-none"
              >
                {renderStars(r.score)}
              </div>
            ))}
          </div>
        )}

        {item.lastEaten && (
          <p className="text-xs text-gray-500">
            最後に食べた日: {item.lastEaten}
          </p>
        )}
      </div>
    </button>
  );
}
