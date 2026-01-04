import { getItems } from "../../src/lib/items";

export default async function TestPage() {
    const items = await getItems();
    console.log(items); // ターミナルで確認
    return (
        <div>
            Firestore データ取得確認: {items.length} 件
        </div>
    );
}