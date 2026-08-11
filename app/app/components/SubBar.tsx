"use client"

/*
    サブバー
    ＜概要＞
        トップバーの下のサブバーを表示する。
        サブバーの中身はそれぞれの呼び元で指定する。
    ＜使い方＞
        サブバー表示
            <SubBar />
*/

import { useGetSubBar, useGetSubBarHeight, useGetSubBarColor } from "@/hooks/useSubBar";

// サブバー表示コンポーネント
export function SubBar() {
    // Contextからサブバーの内容を取得
    const subBar = useGetSubBar();

    // Contextからサブバーの高さを取得
    const subBarHeight = useGetSubBarHeight();

    // Contextからサブバーの背景色を取得
    const subBarColor = useGetSubBarColor();

    // divに適用するスタイル
    const style = {
        height: subBarHeight,
        backgroundColor: subBarColor,
    };

    // サブバーが未設定なら何も表示しない
    if (!subBar) return null;

    return (
        // fixed               : 画面に固定
        // top-[...]           : TopBarの下に配置
        // left-0 / right-0    : 横幅いっぱい
        // flex                : Flexレイアウト
        // items-center        : 縦中央
        // justify-between     : 左右に配置
        // px-1                : 左右4px余白
        // z-[40]              : 重なり順
        <div
            className="
                    fixed top-[var(--topBar-height)] left-0 right-0
                    flex items-center justify-between
                    px-1
                    z-[40]       
                "
            style={style}
        >
            {/* Contextで設定されたサブバーを表示 */}
            {subBar}
        </div>
    );
}
