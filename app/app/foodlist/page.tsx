/*
    foodlist/page.tsx
    ＜概要＞
        FoodListのトップページ。
        タイトルを「食べたものリスト」に設定。
        食べたものリストを表示。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import FoodList from "@/foodlist/components/FoodList";
import { getItems2 } from "@/foodlist/lib/items2";
import { SetTitle } from "@/components/Title";

export const dynamic = "force-dynamic";

export default async function Home() {      // 中でawaitを使っているため、asyncにする
    const items = await getItems2();         // データベースからの読み込みに時間がかかるため、awaitを指定

    return (
        <>
            <SetTitle title="食べたものリスト" />
            <FoodList items={items} />
        </>
    );
}
