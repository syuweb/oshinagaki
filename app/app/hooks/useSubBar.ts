"use client"

/*
    サブバー
    ＜概要＞
        トップバーの下のサブバーを実装する。
        サブバーの中身はそれぞれの呼び元で指定する。
    ＜使い方＞
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

import { useContext, useEffect, DependencyList } from "react";

import { SubBarContext } from "@/providers/SubBarProvider";



// サブバー取得（クライアントコンポーネントからの呼び出し）
export function useGetSubBar() {
    const { subBar } = useSubBar();

    return (subBar);
}

// サブバー取得（サーバコンポーネントからの呼び出し）
export function SubBar() {
    const { subBar } = useSubBar();

    if (subBar) return subBar;
    return null;
}

// サブバー設定（クライアントコンポーネントからの呼び出し）
export function useSetSubBar(
    node: React.ReactNode = null,
    deps: DependencyList = [],
    bgColor: string = "white",
    height: number = 40
) {
    const { setSubBar, setSubBarHeight, setSubBarColor } = useSubBar();

    // useEffectを使ってレンダー実行
    useEffect(() => {
        setSubBarHeight(height);
        setSubBarColor(bgColor);
        setSubBar(node);

        return () => {
            setSubBar(null);
            setSubBarHeight(0);
            setSubBarColor("white");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

// サブバー設定（サーバコンポーネントからの呼び出し）
export function SetSubBar(
    node: React.ReactNode = null,
    deps: DependencyList = [],
    bgColor: string = "white",
    height: number = 40
) {
    useSetSubBar(node, deps, bgColor, height);

    return null;
}

// サブバーの高さ取得
export function useGetSubBarHeight() {
    const { subBarHeight } = useSubBar();

    return (subBarHeight);
}

export function useGetSubBarColor() {
    const { subBarColor } = useSubBar();

    return (subBarColor);
}

// コンテキスト（メニューアイテム、セットメニューアイテム）取得関数
function useSubBar() {
    const context = useContext(SubBarContext);
    if (!context) throw new Error("useSubBar must be used within SubBarProvider");
    return context;
}
