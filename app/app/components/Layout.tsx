"use client"

import React from "react";

/*
    レイアウト表示
    ＜概要＞
        layout.tsxをサーバコンポーネントにするため、クライアント部分を別ファイルに抜き出す。
    ＜使い方＞　
        <Layout children={children} />
*/

import { useGetSubBarHeight } from "@/components/SubBar";
import { useGetBottomBarHeight } from "@/components/BottomBar";

export function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const subBarHeight = useGetSubBarHeight();
    const bottomBarHeight = useGetBottomBarHeight();

    return (
        <main
            className="
                flex-1
                pb-[var(--bottombar-height)]
                overflow-auto //スクロールバーは必要なときのみ表示
                "
            style={{
                paddingTop: `calc(var(--topbar-height) + ${subBarHeight}px)`,
                paddingBottom: bottomBarHeight
            }}
        >
            {children}
        </main>
    );
}
