/*
    foodlist/update/[id]/page.tsx
    ＜概要＞
        FoodListのフードアイテム詳細編集ページ。
        タイトルをメニュー名に設定。
        フードアイテム詳細情報を表示し、編集して更新する。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import { getItem2 } from "@/foodlist/lib/items2";
import { FoodUpdate } from "@/foodlist/components/FoodUpdate";

type PageProps = {
    params: Promise<{ id: string }>;    // []のページの引数はPromiseが必要（URLごとに値が変わるため）
};

export default async function Home({ params }: PageProps) {
    const { id } = await params;  // 全体をawaitしないと中身にアクセスできない。分割代入が必要

    const data = await getItem2({ id });
    if (!data) return;

    const defaultimages = data.images?.map((image) => ({
        url: image.url,
        createdAt: image.createdAt,
        publicId: image.publicId,
    })) ?? [];

    return (
        <>
            <FoodUpdate
                item={data}
                defaultimages={defaultimages}
            />
        </>
    );
}
