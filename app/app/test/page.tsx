import { getItems, addItem } from "../lib/items";

export default async function TestPage() {
    //await addItem({
    //    name: "テストメニュー2",
    //    category: "テスト",
    //    description: "追加テスト",
    //    image: "https://picsum.photos/id/10/800/600",
    //    lastEaten: "2026-01-01",
    //    ratings: [{ name: "しゅう", score: 4 }],
    //});

    const items = await getItems();
    console.log(items); // ターミナルで確認
    return (
        <div>
            Firestore データ取得確認: {items.length} 件
        </div>
    );
}

