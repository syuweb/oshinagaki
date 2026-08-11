"use client"

/*
    メニューアイテムカスタムフック
    ＜概要＞
        メニューのアイテムリストを設定・取得するカスタムフック。
    ＜使い方＞
        メニューアイテム設定：
            useSetMenuItems(items);

            items：設定したいメニューアイテム一覧

        メニューアイテム取得：
            const items = useGetMenuItems();

    （例）
        useSetMenuItems([
            {
                name: "メニュー追加",
                onClick: () => { router.push(`/foodlist/add`); },
            },
            {
                name: "カテゴリー編集",
                onClick: () => { router.push('/foodlist/category') },
            },
        ]);
*/

import { useContext, useEffect } from "react"

import { MenuItem, MenuItemsContext } from "@/providers/MenuItemsProvider";

// メニューアイテム取得用Hook
// コンポーネントからはContextの存在を意識せず、現在のメニュー一覧だけ取得できる
export function useGetMenuItems() {
    // Contextからitemsだけ取り出す
    const { items } = useMenuItems();

    // 現在のメニューアイテム一覧を返す
    return (items);
}

// メニューアイテム設定用Hook
// useEffectを利用して、レンダー完了後に MenuItemsProviderのメニュー一覧を更新する
// itemsはuseMemoなどで参照を安定させて渡すことを想定している

export function useSetMenuItems(
    items: MenuItem[]
) {
    // Contextから状態更新関数を取得
    const { setItems } = useMenuItems();

    // レンダー完了後にメニュー一覧を更新する。
    // レンダー中にsetItemsを呼ぶと、 ReactのState更新エラーになる可能性があるため、 useEffect内で実行している。
    // itemsまたはsetItemsの参照が変わったときのみ 再実行される。
    useEffect(() => {
        setItems(items)
    }, [items, setItems]);
}

// MenuItemsContextから値を取得する共通関数
// useContextはProviderの外で呼ぶとundefinedになるため、利用場所をチェックしている
function useMenuItems() {
    // MenuItemsProviderが提供しているContextの値を取得
    const context = useContext(MenuItemsContext);

    // Provider配下で使用されていない場合はエラー
    if (!context) {
        throw new Error("useGetMenuItems/useSetMenuItems must be used within MenuItemsProvider");
    }

    // items, setItemsを返す
    return context;
}
