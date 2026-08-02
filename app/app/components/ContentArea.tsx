"use client"

/*
    コンテンツ領域表示
    ＜概要＞
        画面中央のメインコンテンツ領域を担当する。
        TopBar、SubBar、BottomBarの高さを考慮して、子コンテンツ(children)を正しい位置に表示する。
    ＜使い方＞
        <Layout children={children} />
*/

import type { ReactNode } from "react";
import { useGetBottomBarHeight } from "@/components/BottomBar";
import { useGetSubBarHeight } from "@/hooks/useSubBar";

export function ContentArea({
    children,
}: Readonly<{
    children: ReactNode;
}>) {

    // SubBarの現在の高さをContextから取得
    // 例：カテゴリタブなどが表示されている場合、その高さ分だけ下げる
    const subBarHeight = useGetSubBarHeight();

    // BottomBarの高さをContextから取得
    // 画面下部固定バーとコンテンツが重ならないようにする
    const bottomBarHeight = useGetBottomBarHeight();


    return (
        <main
            className="
                flex-1

                // 下部固定バー分の余白を確保
                // （ただしstyle側のpaddingBottomで上書きされるため不要なら削除可能）
                pb-[var(--bottombar-height)]

                // コンテンツが領域を超えた場合だけスクロールバーを表示
                overflow-auto
            "

            style={{
                // 上部固定バー分の余白を設定
                //
                // TopBarは固定表示されているため、
                // 通常のレイアウトではその下にコンテンツが流れ込んでしまう。
                //
                // そこで
                //   TopBarの高さ
                // + SubBarの高さ
                //
                // 分だけpadding-topを確保する。
                paddingTop: `calc(var(--topbar-height) + ${subBarHeight}px)`,

                // 下部固定バー分の余白を設定
                //
                // BottomBarがposition: fixedの場合、
                // コンテンツの最後の部分が隠れないようにする。
                paddingBottom: bottomBarHeight
            }}
        >

            {/* 呼び出し元から渡された画面内容を表示 */}
            {children}

        </main>
    );
}
