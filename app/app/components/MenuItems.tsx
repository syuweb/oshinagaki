"use client"

/*
    メニューアイテム
    ＜概要＞
        メニューのアイテムリストを設定・取得する
    ＜使い方＞
        プロバイダ設定
            <MenuItemsProvider>
                この中でメニューアイテム設定、メニューアイテム取得を実行
            </MenuItemsProvider>
        メニューアイテム設定：
            useSetMenuItems(MenuItem[], [item1, item2]);
                or
            <SetMenuItems items={MenuItem} deps={[item1, item2]} />

            [item1, item2]：依存配列
        メニューアイテム取得：
            useGetMenuItems();
    ＜注意＞
        useSetMenuItems, useGetMenuItemを使う際には"use client"が必要

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

        <SetMenuItems
            items={[
                {
                    name: "メニュー追加",
                    onClick: () => { router.push(`/foodlist/add`); },
                },
                {
                    name: "カテゴリー編集",
                    onClick: () => { router.push('/foodlist/category') },
                },
            ]}
        />
*/

import { useState, createContext, useContext, useEffect, DependencyList } from "react"

// メニューアイテム
export type MenuItem = {
    name: string;               // メニュー表示名
    onClick?: () => void;       // メニュー選択時の実行関数
}

// コンテキストタイプ：メニューアイテムのリストとセットアイテムを共有
type MenuItemsContextType = {
    items: MenuItem[];
    setItems: (items: MenuItem[]) => void;
}

// コンテキスト設定
const MenuItemsContext = createContext<MenuItemsContextType | undefined>(undefined);

// プロバイダ設定　プロバイダで囲んでコンテキストを共有
export function MenuItemsProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [items, setItems] = useState<MenuItem[]>([]);
    return (
        <MenuItemsContext.Provider value={{ items, setItems }}>
            {children}
        </MenuItemsContext.Provider>
    );
}

// コンテキスト（メニューアイテム、セットメニューアイテム）取得関数
function useMenuItems() {
    const context = useContext(MenuItemsContext);
    if (!context) throw new Error("useMenuItems must be used within MenuItemsProvider");
    return context;
}

// メニューアイテム取得
export function useGetMenuItems() {
    const { items } = useMenuItems();

    return (items);
}

// メニューアイテム設定（クライアントコンポーネントからの呼び出し）
export function useSetMenuItems(
    items: MenuItem[],
    deps: DependencyList = []
) {
    const { setItems } = useMenuItems();

    // useEffectを使ってレンダー実行
    useEffect(() => {
        setItems(items)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

// メニューアイテム設定（サーバコンポーネントからの呼び出し）
export function SetMenuItems({ items, deps, }: Readonly<{ items: MenuItem[]; deps: DependencyList }>) {
    useSetMenuItems(items, deps);

    return null;
}