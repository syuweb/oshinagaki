/*
    foodlist/category/page.tsx
    ＜概要＞
        FoodListのカテゴリ編集ページ。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import CategoryList from "@/foodlist/components/CategoryList"
import { SetTitle } from "@/components/Title"
import { getFoodCategories } from "@/foodlist/lib/foodCategory"

export default async function Home() {              // 中でawaitを使っているため、asyncにする
    const categories = await getFoodCategories();   // データベースからの読み込みに時間がかかるため、awaitを指定

    return (
        <>
            <SetTitle title="カテゴリー編集" />
            <CategoryList
                categories={categories}
            />
        </>
    );
}