"use client"

/*
    ボトムバープロバイダ
    ＜概要＞
        画面下部のボトムバーに関するコンテキストプロバイダ
    ＜使い方＞
        プロバイダ設定
            <BottomBarProvider>
                この中でボトムバー設定、取得を実行
            </BottomBarProvider>
*/

import type { ReactNode } from "react";
import { createContext, useState } from "react";

import { BOTTOM_BAR_BG_COLOR } from "@/constants/layoutConstant";

// コンテキストで共有するデータの型定義
type BottomBarContextType = {
    bottomBar: ReactNode;                                  // ボトムバーに表示するReact要素
    setBottomBar: (node: ReactNode) => void;               // ボトムバーの表示内容を変更する関数
    bottomBarHeight: string;                               // ボトムバーの高さ(px)
    setBottomBarHeight: (height: string) => void;          // ボトムバーの高さを変更する関数
    bottomBarColor: string;                                // ボトムバーの背景色
    setBottomBarColor: (bgColor: string) => void;          // ボトムバーの背景色を変更する関数
}

// コンテキスト設定
// Provider外で使用された場合はundefinedになる
export const BottomBarContext = createContext<BottomBarContextType | undefined>(undefined);

// プロバイダ設定
// SubBar関連の状態をアプリ全体で共有する
export function BottomBarProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const [bottomBar, setBottomBar] = useState<ReactNode>(null);                // ボトムバーに表示する内容
    const [bottomBarHeight, setBottomBarHeight] = useState("0px");              // ボトムバーの高さ
    const [bottomBarColor, setBottomBarColor] = useState(BOTTOM_BAR_BG_COLOR);  // ボトムバーの背景色

    return (
        <BottomBarContext.Provider value={{ bottomBar, setBottomBar, bottomBarHeight, setBottomBarHeight, bottomBarColor, setBottomBarColor }}>
            {children}
        </BottomBarContext.Provider>
    );
}
