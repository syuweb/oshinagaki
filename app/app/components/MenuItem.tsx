// app/components/MenuItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
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

    return <button onClick={handleDelete}>削除</button>;
}

type Props = {
  item: ItemDoc;
  checked: boolean;
  onToggle: (id: string) => void;
};

export default function MenuItem({ item, checked, onToggle }: Props) {
  const renderStars = (value: number) =>
  "★★★★★☆☆☆☆☆".slice(5 - value, 10 - value);

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {/* チェックボックス */}
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(item.id)}
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0"
      />

      {/* クリック領域は Link 側に限定 */}
      <Link
        href={`/menu/${item.id}`}
        className="flex items-center gap-3 flex-1 active:bg-gray-100 rounded"
      >
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

        <div className="flex-1">
          <p className="font-medium text-sm">{item.name}</p>
          
          {/*item.ratings?.[0] && (
            <p className="text-xs text-yellow-600 leading-none">
            {renderStars(item.ratings[0].score)}
            </p>
          )*/}

          {/* 評価（一覧用） */}
          {item.ratings && item.ratings.length > 0 && (
            <div className="flex gap-4 mt-1">
              {item.ratings.map((r, i) => (
                <div key={i} className="flex items-center gap-1 text-xs text-yellow-600 leading-none">
                  <span>
                    {renderStars(r.score)}
                  </span>
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
      </Link>
    </div>
  );
}

//export default function MenuItem({ item }: MenuItemProps) {
    
    /*
    const router = useRouter();

    const handleDelete = async () => {
        await deleteItem(item.id);
        router.refresh(); // ← これが①の正体
    };
    */

    /*
    <button onClick={handleDelete}>
        delete
    </button>
    */
   /*
    return (
        <div>
            <DeleteButton id={item.id} />
            <Link href={`/menu/${item.id}`} className="block active:bg-gray-100">
                <div className="flex items-center gap-3 px-3">
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
                    <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        {item.lastEaten && (
                            <p className="text-xs text-gray-500">
                                最後に食べた日: {item.lastEaten}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
    */
//}