"use client"

/*
    コンテンツ領域表示

    ＜概要＞
        画面中央のメインコンテンツ領域を担当する。
        
        TopBar、SubBar、BottomBarは画面上・下に固定表示されるため、
        子コンテンツ(children)がこれらのバーと重ならないように、
        それぞれの高さを考慮して余白を設定する。

    ＜使い方＞
        ContentAreaで画面のメインコンテンツを囲む。
*/

import type { ReactNode } from "react";

import { useGetBottomBarHeight } from "@/hooks/useBottomBar";
import { useGetSubBarHeight } from "@/hooks/useSubBar";

export function ContentArea({
    children,
}: Readonly<{
    children: ReactNode;
}>) {

    // SubBarの現在の高さをContextから取得
    // SubBarが表示されていない場合は0になる
    const subBarHeight = useGetSubBarHeight();

    // BottomBarの現在の高さをContextから取得
    // BottomBarが表示されていない場合は0になる
    const bottomBarHeight = useGetBottomBarHeight();

    return (
        // flex-1：親のFlexレイアウト内で、ContentAreaを利用可能な領域いっぱいに広げる
        //          ※ fixed要素はFlexレイアウトの計算対象外
        //          　 余白で表示領域を指定しているが、エリアの大きさを指定する必要がある
        //          　 エリア領域と表示領域は同じでなくていい
        // overflow-auto：コンテンツが領域を超えた場合だけスクロールバーを表示する
        <main
            className="
                flex-1
                overflow-auto
            "
            style={{
                // TopBar + SubBarの高さ分だけ上側に余白を確保する
                // 固定表示されているバーとコンテンツが重ならないようにする
                paddingTop: `calc(var(--topBar-height) + ${subBarHeight})`,

                // BottomBarの高さ分だけ下側に余白を確保する
                // コンテンツの最後の部分がBottomBarに隠れないようにする
                paddingBottom: bottomBarHeight,
            }}
        >
            {/* 呼び出し元から渡された画面内容を表示 */}
            {children}
        </main>
    );
}
