import { getItems } from "@/lib/items";
import MenuDetail from "@/components/MenuDetail"; // Client Component
import AppContainer from "@/components/AppContainer"

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ id: string }>
};

export default async function ItemDetailPage({ params }: PageProps) {
    const { id } = await params;
    const items = await getItems();
    const item = items.find(i => i.id === id);
    if (!item) return <div>メニューが見つかりません</div>;

    return (
        <AppContainer>
            <MenuDetail item={item} />
        </AppContainer>
    );
}