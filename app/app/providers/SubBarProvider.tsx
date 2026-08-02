"use client"

/*
    サブバー
    ＜概要＞
        トップバーの下のサブバーを実装する。
        サブバーの中身はそれぞれの呼び元で指定する。
    ＜使い方＞
        プロバイダ設定
            <SubBarProvider>
                この中でメニューアイテム設定、メニューアイテム取得を実行
            </SubBarProvider>
        サブバー設定：
            useSetSubBar(children, bgColor, height);
                or
            <SetSubBar node={Node} bgColor={bgColor} height={height} />
        サブバー取得：
            useGetSubBar();
        サブバー表示
            <SubBar />
        サブバー高さ取得
            useGetSubBarHeight();
    ＜注意＞
        useSetSubBar, useGetSubBar, useGetSubBarHeightを使う際には"use client"が必要
*/

import { createContext, useState } from "react"

// コンテキストタイプ：サブバーとセットサブバーを共有
type SubBarContextType = {
    subBar: React.ReactNode;
    setSubBar: (node: React.ReactNode) => void;
    subBarHeight: number;
    setSubBarHeight: (height: number) => void;
    subBarColor: string;
    setSubBarColor: (bgColor: string) => void;
}

// コンテキスト設定
export const SubBarContext = createContext<SubBarContextType | undefined>(undefined);

// プロバイダ設定 プロバイダで囲んでコンテキストを共有
export function SubBarProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [subBar, setSubBar] = useState<React.ReactNode>([]);
    const [subBarHeight, setSubBarHeight] = useState(0);
    const [subBarColor, setSubBarColor] = useState("white");

    return (
        <SubBarContext.Provider value={{ subBar, setSubBar, subBarHeight, setSubBarHeight, subBarColor, setSubBarColor }}>
            {children}
        </SubBarContext.Provider>
    );
}
