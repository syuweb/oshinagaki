"use client"

/*
    メニューアイテムプロバイダ
    ＜概要＞
        メニューのアイテムリストを設定・取得するコンテキストプロバイダ
    ＜使い方＞
        <MenuItemsProvider>
            この中でメニューアイテム設定、メニューアイテム取得を実行
        </MenuItemsProvider>
*/

import type { ReactNode } from "react";
import { useState, createContext } from "react"

// メニューアイテムの型定義
// メニュー1件分がどんなデータを持つかを定義する
export type MenuItem = {
    name: string;               // メニュー表示名
    onClick?: () => void;       // メニュー選択時の実行関数
    // 引数なし、返値なしの関数
    // 省略可。クリックできないメニュー項目（セパレータなど）も設定できる
}

// Contextで共有するデータの型定義
type MenuItemsContextType = {
    items: MenuItem[];                          // 現在登録されているメニュー項目の配列
    setItems: (items: MenuItem[]) => void;      // メニュー項目を変更する関数
    // 引数はメニュー項目の配列、返値なし
}

// Contextを作成
// createContext<contextの型>(初期値)：contextの型は上で定義したデータ型。初期値をundefinedにするため、| undefinedをつける。
export const MenuItemsContext = createContext<MenuItemsContextType | undefined>(undefined);

// プロバイダ設定
// MenuItemsProviderというReactコンポーネントを作る。
// 中に配置された子コンポーネント（children）を受け取り、それらにMenuItemsContextを提供する。
// childrenはReactで表示可能な任意の要素で、props(children)は変更不可。
export function MenuItemsProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    // メニュー項目一覧をstateとして管理
    // const [状態, 状態更新関数] = useState<型>(初期値);
    // 型：MenuItem[]　メニュー項目の配列
    // 初期値：[]　空配列
    const [items, setItems] = useState<MenuItem[]>([]);

    return (
        <MenuItemsContext.Provider value={{ items, setItems }}>
            {children}
        </MenuItemsContext.Provider>
    );
}
