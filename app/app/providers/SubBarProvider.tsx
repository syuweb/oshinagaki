"use client"

/*
    サブバープロバイダ
    ＜概要＞
        トップバーの下のサブバーに関するコンテキストプロバイダ
    ＜使い方＞
        プロバイダ設定
            <SubBarProvider>
                この中でサブバー設定、取得を実行
            </SubBarProvider>
*/

import type { ReactNode } from "react";
import { createContext, useState } from "react";

import { SUB_BAR_BG_COLOR } from "@/constants/layoutConstant";

// コンテキストで共有するデータの型定義
type SubBarContextType = {
    subBar: ReactNode;                                  // サブバーに表示するReact要素
    setSubBar: (node: ReactNode) => void;               // サブバーの表示内容を変更する関数
    subBarHeight: string;                               // サブバーの高さ(px)
    setSubBarHeight: (height: string) => void;          // サブバーの高さを変更する関数
    subBarColor: string;                                // サブバーの背景色
    setSubBarColor: (bgColor: string) => void;          // サブバーの背景色を変更する関数
}

// コンテキスト設定
// Provider外で使用された場合はundefinedになる
export const SubBarContext = createContext<SubBarContextType | undefined>(undefined);

// プロバイダ設定
// SubBar関連の状態をアプリ全体で共有する
export function SubBarProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const [subBar, setSubBar] = useState<ReactNode>(null);              // サブバーに表示する内容
    const [subBarHeight, setSubBarHeight] = useState("0px");            // サブバーの高さ
    const [subBarColor, setSubBarColor] = useState(SUB_BAR_BG_COLOR);   // サブバーの背景色

    return (
        <SubBarContext.Provider value={{ subBar, setSubBar, subBarHeight, setSubBarHeight, subBarColor, setSubBarColor }}>
            {children}
        </SubBarContext.Provider>
    );
}
