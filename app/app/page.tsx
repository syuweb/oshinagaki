// app/page.tsx
import MenuList from "@/components/MenuList"; // Client Component
import { getItems } from "@/lib/items";
//import type { ItemDoc } from "@/lib/item";
//import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await getItems();
  return <MenuList items={items} />;
}

/*
export default async function Page() {
  const items = await getItems();

  const grouped = items.reduce<Record<string, ItemDoc[]>>((acc, item) => {
    const key =
      item.category && item.category.trim() !== ""
        ? item.category
        : "その他";

    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link href="/items/add">追加</Link>
      </div>

      <MenuList groupedItems={grouped} />
    </>
  );
}
*/