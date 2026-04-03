"use client"

/*
    タイトル
    ＜概要＞
        トップバーに表示するタイトルを設定
    ＜使い方＞
        タイトル設定：
            useSetTitle("タイトル");
        タイトル取得：
            useGetTitle();
    ＜注意＞
        "use client"が必要
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
export function TitleProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState("");
    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
}

// コンテキスト（タイトル、セットタイトル）取得関数
export function useTitle() {
    const context = useContext(TitleContext);
    if (!context) throw new Error("useTitle must be used within TitleProvider");
    return context;
}

// タイトル取得
export function useGetTitle() {
    const { title } = useTitle();

    return (title);
}

// タイトル設定
export function useSetTitle(title: string) {
    const { setTitle } = useTitle();

    // useEffectを使ってタイトル変更時にレンダー実行
    useEffect(() => {
        setTitle(title)
    }, [title, setTitle])
}