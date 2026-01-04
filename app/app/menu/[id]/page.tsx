//import Image from "next/image";
//import Link from "next/link";
//import { notFound } from "next/navigation";
//import { menuItems } from "../../data/menu";
import { getItems } from "../../../src/lib/items";
import MenuDetail from "../../components/MenuDetail"; // Client Component

type PageProps = {
    params: Promise<{ id: string }>
};

export default async function ItemDetailPage({ params }: PageProps) {
    const { id } = await params;
    const items = await getItems();
    const item = items.find(i => i.id === id);
    if (!item) return <div>メニューが見つかりません</div>;

    return <MenuDetail item={item} />;
}