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

import { useContext, useEffect } from "react"

import { TitleContext } from "@/providers/TitleProvider"

// 現在のタイトルを取得するフック
export function useGetTitle() {
    // Contextからtitleだけ取得
    const { title } = useTitle();

    // 現在のタイトルを返す
    return (title);
}

// 指定したタイトルをContextへ設定するフック
export function useSetTitle(
    title: string,
) {
    // Contextから更新関数を取得
    const { setTitle } = useTitle();

    // titleが変わるたびにContextを更新
    useEffect(() => {
        setTitle(title)
    }, [title, setTitle])
}

// サーバコンポーネントから利用するためのラッパーコンポーネント
export function SetTitle({
    title,
}: Readonly<{
    title: string;
}>) {
    // 内部ではuseSetTitleを呼び出すだけ
    useSetTitle(title);

    // UIは何も表示しない
    return null;
}

// TitleContextを扱う共通フック
function useTitle() {
    // TitleContextから値を取得
    const context = useContext(TitleContext);

    // Provider外で使用された場合はエラー
    if (!context) throw new Error("useGetTitle/useSetTitle must be used within TitleProvider");

    // titleとsetTitleを返す
    return context;
}
