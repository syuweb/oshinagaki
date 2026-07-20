/*
    foodlist/detail/[id]/page.tsx
    ＜概要＞
        FoodListのメニュー詳細表示ページ。
        タイトルを「メニュー名」に設定。
        メニューの画像、説明、最後に食べた日、カテゴリ、評価を表示。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import FoodDetail from "@/foodlist/components/FoodDetail"
import { getItem2 } from "@/foodlist/lib/items2"
import { getFoodCategories } from "@/foodlist/lib/foodCategory"

type PageProps = {
    params: Promise<{ id: string }>;    // []のページの引数はPromiseが必要（URLごとに値が変わるため）
};

export default async function Home({ params }: PageProps) {
    const { id } = await params;  // 全体をawaitしないと中身にアクセスできない。分割代入が必要

    const data = await getItem2({ id });
    if (!data) return;

    const categories = await getFoodCategories();
    const category = data.categoryId ? categories.find((c) => c.id === data.categoryId) : null;
    const categoryName = category === null ? "" : category?.name ?? "";

    return (
        <FoodDetail
            item={data}
            category={categoryName}
        />
    );
}
