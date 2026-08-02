/*
    foodlist/edit/page.tsx
    ＜概要＞
        FoodListのメニュー編集ページ。
        タイトルを「食べたものリスト編集」に設定。
        食べたものリストを表示。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import FoodEdit from "@/foodlist/components/FoodEdit";
import { getItems2 } from "@/foodlist/lib/items2";                 //★旧フォーマット
import { SetTitle } from "@/hooks/useTitle"

export const dynamic = "force-dynamic";

export default async function Home() {      // 中でawaitを使っているため、asyncにする
    const items = await getItems2();         // データベースからの読み込みに時間がかかるため、awaitを指定

    return (
        <>
            <SetTitle title="食べたものリスト編集" />
            <FoodEdit items={items} />
        </>
    );
}