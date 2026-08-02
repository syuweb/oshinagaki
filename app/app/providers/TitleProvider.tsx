"use client"

/*
    タイトル
    ＜概要＞
        トップバーに表示するタイトルを設定・取得する
    ＜使い方＞
        <TitleProvider>
            この中でタイトル設定、タイトル取得を実行
        </TitleProvider>
*/

import { useState, createContext } from "react"

// コンテキストで共有するデータの型定義
type TitleContextType = {
    title: string;                          // 現在のタイトル
    setTitle: (title: string) => void;      // タイトルを更新する関数
}

// コンテキストを作成
// 初期値はundefinedにして、Provider外で使われた場合に検出できるようにする
export const TitleContext = createContext<TitleContextType | undefined>(undefined);
// createContext<contextの型>(初期値)：contextの型は上で定義したデータ型。初期値をundefinedにするため、| undefinedをつける。

// プロバイダ設定
// TitleProviderというReactコンポーネントを作る。
// 中に配置された子コンポーネント（children）を受け取り、それらにTitleContextを提供する。
// childrenはReactで表示可能な任意の要素で、props(children)は変更不可。
export function TitleProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    // タイトルを保持するState。初期値は空文字
    const [title, setTitle] = useState("");

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
}
