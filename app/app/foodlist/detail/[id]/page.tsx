import { getItem } from "@/foodlist/lib/items"

type PageProps = {
    params: Promise<{ id: string }>;    // []のページの引数はPromiseが必要（URLごとに値が変わるため）
};

export default async function ItemDetailPage({ params }: PageProps) {
    const { id } = await params;  // 全体をawaitしないと中身にアクセスできない。分割代入が必要

    const data = await getItem({ id });

    return (
        <div>TEST {data?.name}</div>
    );
}
