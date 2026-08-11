"use client"

/*
    ボトムバー
    ＜概要＞
        画面下のボトムバーを実装する。
        ボトムバーの中身はそれぞれの呼び元で指定する。
    ＜使い方＞
        ボトムバー表示
            <BottomBar />
*/

import { useGetBottomBar, useGetBottomBarHeight, useGetBottomBarColor } from "@/hooks/useBottomBar";

// ボトムバー表示コンポーネント
export function BottomBar() {
    // Contextからボトムバーの内容を取得
    const bottomBar = useGetBottomBar();

    // Contextからボトムバーの高さを取得
    const bottomBarHeight = useGetBottomBarHeight();

    // Contextからボトムバーの背景色を取得
    const bottomBarColor = useGetBottomBarColor();

    // divに適用するスタイル
    const style = {
        height: bottomBarHeight,
        backgroundColor: bottomBarColor,
    };

    // ボトムバーが未設定なら何も表示しない
    if (!bottomBar) return null;

    return (
        // fixed               : 画面に固定
        // bottom-0            : 画面最下部に配置
        // left-0 / right-0    : 横幅いっぱい
        // z-[40]              : 重なり順
        <div
            className="
                    fixed bottom-0 left-0 right-0
                    z-[40]       
                "
            style={style}
        >
            {/* Contextで設定されたボトムバーを表示 */}
            {bottomBar}
        </div>
    );
}
