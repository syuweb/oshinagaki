/*
    foodlist/add/page.tsx
    ＜概要＞
        FoodListの新規フードアイテム追加ページ。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import { SetTitle } from "@/components/Title"
import { AddNewItem } from "@/foodlist/components/AddNewItem"

export default async function Home() {
    return (
        <>
            <SetTitle title="カテゴリー編集" />
            <AddNewItem />
        </>
    );
}