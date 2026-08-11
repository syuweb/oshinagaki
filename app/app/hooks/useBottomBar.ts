"use client"

/*
    ボトムバー
    ＜概要＞
        画面下のボトムバーを実装する。
        ボトムバーの中身はそれぞれの呼び元で指定する。
    ＜使い方＞
        ボトムバー取得：
            useGetBottomBar();
        ボトムバー設定：
            useSetBottomBar(children);
        ボトムバー高さ取得：
            useGetBottomBarHeight();
        ボトムバー高さ設定：
            useSetBottomBarHeight(height);
        ボトムバー背景色取得：
            useGetBottomBarColor();
        ボトムバー背景色設定：
            useSetBottomBarColor(color);
*/

import type { ReactNode } from "react";
import { useContext, useEffect } from "react";

import { BOTTOM_BAR_BG_COLOR } from "@/constants/layoutConstant";
import { BottomBarContext } from "@/providers/BottomBarProvider";

// ボトムバー取得
// Contextに保持されているボトムバーを取得する
export function useGetBottomBar() {
    // Contextからサブバーを取得
    const { bottomBar } = useBottomBar();

    return (bottomBar);
}

// ボトムバー設定
// マウント時にボトムバーを登録し、アンマウント時にボトムバーを解除する
export function useSetBottomBar(
    node: ReactNode = null,
) {
    // Contextから更新関数を取得
    const { setBottomBar } = useBottomBar();

    // ボトムバーを登録
    useEffect(() => {
        setBottomBar(node);

        // コンポーネント破棄時にボトムバーを解除
        return () => {
            setBottomBar(null);
        }
    }, [node, setBottomBar]);
};

// ボトムバー高さ取得
export function useGetBottomBarHeight() {
    // Contextから高さを取得
    const { bottomBarHeight } = useBottomBar();

    return (bottomBarHeight);
}

// ボトムバー高さ設定
export function useSetBottomBarHeight(
    height: string,
) {
    // Contextから更新関数を取得
    const { setBottomBarHeight } = useBottomBar();

    // ボトムバー高さを更新
    useEffect(() => {
        setBottomBarHeight(height);

        // コンポーネント破棄時にボトムバー高さを初期化(0)
        return () => {
            setBottomBarHeight("0px");
        }
    }, [height, setBottomBarHeight]);
}

// ボトムバー背景色取得
export function useGetBottomBarColor() {
    // Contextから背景色を取得
    const { bottomBarColor } = useBottomBar();

    return (bottomBarColor);
}

// ボトムバー背景色設定
export function useSetBottomBarColor(
    color: string,
) {
    // Contextから更新関数を取得
    const { setBottomBarColor } = useBottomBar();

    // ボトムバー背景色を更新
    useEffect(() => {
        setBottomBarColor(color);

        // コンポーネント破棄時にボトムバー背景色を初期化(white)
        return () => {
            setBottomBarColor(BOTTOM_BAR_BG_COLOR);
        }
    }, [color, setBottomBarColor]);
}

// Context取得用共通Hook
// Provider外で呼び出された場合はエラーにする
function useBottomBar() {
    const context = useContext(BottomBarContext);

    if (!context) {
        throw new Error("useBottomBar must be used within BottomBarProvider");
    }

    return context;
}