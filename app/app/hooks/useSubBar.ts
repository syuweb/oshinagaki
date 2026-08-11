"use client"

/*
    サブバー
    ＜概要＞
        トップバーの下のサブバーを実装する。
        サブバーの中身はそれぞれの呼び元で指定する。
    ＜使い方＞
        サブバー取得：
            useGetSubBar();
        サブバー設定：
            useSetSubBar(children);
        サブバー高さ取得：
            useGetSubBarHeight();
        サブバー高さ設定：
            useSetSubBarHeight(height);
        サブバー背景色取得：
            useGetSubBarColor();
        サブバー背景色設定：
            useSetSubBarColor(color);
*/

import type { ReactNode } from "react";
import { useContext, useEffect } from "react";

import { SUB_BAR_BG_COLOR } from "@/constants/layoutConstant";
import { SubBarContext } from "@/providers/SubBarProvider";

// サブバー取得
// Contextに保持されているサブバーを取得する
export function useGetSubBar() {
    // Contextからサブバーを取得
    const { subBar } = useSubBar();

    return (subBar);
}

// サブバー設定
// マウント時にサブバーを登録し、アンマウント時にサブバーを解除する
export function useSetSubBar(
    node: ReactNode = null,
) {
    // Contextから更新関数を取得
    const { setSubBar } = useSubBar();

    // サブバーを登録
    useEffect(() => {
        setSubBar(node);

        // コンポーネント破棄時にサブバーを解除
        return () => {
            setSubBar(null);
        }
    }, [node, setSubBar]);
}

// サブバー高さ取得
export function useGetSubBarHeight() {
    // Contextから高さを取得
    const { subBarHeight } = useSubBar();

    return (subBarHeight);
}

// サブバー高さ設定
export function useSetSubBarHeight(
    height: string,
) {
    // Contextから更新関数を取得
    const { setSubBarHeight } = useSubBar();

    // サブバー高さを更新
    useEffect(() => {
        setSubBarHeight(height);

        // コンポーネント破棄時にサブバー高さを初期化(0)
        return () => {
            setSubBarHeight("0px");
        }
    }, [height, setSubBarHeight]);
}

// サブバー背景色取得
export function useGetSubBarColor() {
    // Contextから背景色を取得
    const { subBarColor } = useSubBar();

    return (subBarColor);
}

// サブバー背景色設定
export function useSetSubBarColor(
    color: string,
) {
    // Contextから更新関数を取得
    const { setSubBarColor } = useSubBar();

    // サブバー背景色を更新
    useEffect(() => {
        setSubBarColor(color);

        // コンポーネント破棄時にサブバー背景色を初期化(white)
        return () => {
            setSubBarColor(SUB_BAR_BG_COLOR);
        }
    }, [color, setSubBarColor]);
}

// Context取得用共通Hook
// Provider外で呼び出された場合はエラーにする
function useSubBar() {
    const context = useContext(SubBarContext);

    if (!context) {
        throw new Error("useSubBar must be used within SubBarProvider");
    };

    return context;
}
