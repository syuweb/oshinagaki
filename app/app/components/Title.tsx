"use client"

/*
    タイトル
    ＜概要＞
        トップバーに表示するタイトルを設定・取得する
    ＜使い方＞
        プロバイダ設定
            <TitleProvider>
                この中でタイトル設定、タイトル取得を実行
            </TitleProvider>
        タイトル設定：
            useSetTitle("タイトル");
                or
            <SetTitle title="タイトル" />
        タイトル取得：
            useGetTitle();
    ＜注意＞
        useSetTitle, useGetTitleを使う際は"use client"が必要
*/

import { useState, createContext, useContext, useEffect } from "react"

// コンテキストタイプ：タイトルとセットタイトルを共有
type TitleContextType = {
    title: string;
    setTitle: (title: string) => void;
}

// コンテキスト設定
const TitleContext = createContext<TitleContextType | undefined>(undefined);

// プロバイダ設定　プロバイダで囲んでコンテキストを共有
export function TitleProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [title, setTitle] = useState("");
    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
}

// コンテキスト（タイトル、セットタイトル）取得関数
function useTitle() {
    const context = useContext(TitleContext);
    if (!context) throw new Error("useTitle must be used within TitleProvider");
    return context;
}

// タイトル取得
export function useGetTitle() {
    const { title } = useTitle();

    return (title);
}

// タイトル設定（クライアントコンポーネントからの呼び出し）
export function useSetTitle(title: string) {
    const { setTitle } = useTitle();

    // useEffectを使ってタイトル変更時にレンダー実行
    useEffect(() => {
        setTitle(title)
    }, [title, setTitle])
}

// タイトル設定（サーバコンポーネントからの呼び出し）
export function SetTitle({ title, }: Readonly<{ title: string; }>) {
    useSetTitle(title);

    return null;
}