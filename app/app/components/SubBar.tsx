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

import { createContext, useState, useContext, useEffect, DependencyList } from "react"

// コンテキストタイプ：サブバーとセットサブバーを共有
type SubBarContextType = {
    subBar: React.ReactNode;
    setSubBar: (node: React.ReactNode) => void;
    subBarHeight: number;
    setSubBarHeight: (height: number) => void;
}

// コンテキスト設定
const SubBarContext = createContext<SubBarContextType | undefined>(undefined);

// プロバイダ設定　プロバイダで囲んでコンテキストを共有
export function SubBarProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [subBar, setSubBar] = useState<React.ReactNode>([]);
    const [subBarHeight, setSubBarHeight] = useState(0);

    return (
        <SubBarContext.Provider value={{ subBar, setSubBar, subBarHeight, setSubBarHeight }}>
            {children}
        </SubBarContext.Provider>
    );
}

// コンテキスト（メニューアイテム、セットメニューアイテム）取得関数
function useSubBar() {
    const context = useContext(SubBarContext);
    if (!context) throw new Error("useSubBar must be used within SubBarProvider");
    return context;
}

// サブバー取得（クライアントコンポーネントからの呼び出し）
export function useGetSubBar() {
    const { subBar } = useSubBar();

    return (subBar);
}

// サブバー取得（サーバコンポーネントからの呼び出し）
export function SubBar() {
    const { subBar } = useSubBar();

    if (subBar) return subBar;
    return (<></>);
}

// サブバー設定（クライアントコンポーネントからの呼び出し）
export function useSetSubBar(
    node: React.ReactNode = null,
    deps: DependencyList = [],
    bgColor: string = "white",
    height: number = 40
) {
    const { setSubBar, setSubBarHeight } = useSubBar();

    // useEffectを使ってレンダー実行
    useEffect(() => {
        setSubBarHeight(height);

        setSubBar(
            <div
                className="
                    fixed                       // 画面基準で固定位置
                    top-[var(--topbar-height)]   // トップバーの下端から
                    left-0                      // 左端から0px
                    right-0                     // 右端から0px
                    flex                        // 中身をflexboxレイアウトにする
                    items-center                // 縦方向中央揃え
                    justify-between             // 中身を両端とその間に均等に配置
                    px-1                        // 左右パディング 0.25rem(4px)
                    z-[40]                      // z-index       
                "
                style={{ height: height, backgroundColor: bgColor }}
            >
                {node}
            </div>
        )

        return () => {
            setSubBar(null);
            setSubBarHeight(0);
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
