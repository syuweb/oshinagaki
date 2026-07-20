"use client"

/*
    ボトムバー
    ＜概要＞
        画面下のボトムバーを実装する。
        ボトムバーの中身はそれぞれの呼び元で指定する。
    ＜使い方＞
        プロバイダ設定
            <BottomBarProvider>
                この中でメニューアイテム設定、メニューアイテム取得を実行
            </BottomBarProvider>
        ボトムバー設定：
            useSetBottomBar(node, bgColor, height);
                or
            <SetBottomBar node={Node} bgColor={bgColor} height={height} />
        ボトムバー取得：
            useGetBottomBar();
        ボトムバー表示
            <BottomBar />
        ボトムバー高さ取得
            useGetBottomBarHeight();
    ＜注意＞
        useSetBottomBar, useGetBottomBar, useGetBottomBarHeightを使う際には"use client"が必要
*/

import { createContext, useState, useContext, useEffect, DependencyList } from "react"

// コンテキストタイプ：サブバーとセットサブバーを共有
type BottomBarContextType = {
    bottomBar: React.ReactNode;
    setBottomBar: (node: React.ReactNode) => void;
    bottomBarHeight: number;
    setBottomBarHeight: (height: number) => void;
}

// コンテキスト設定
const BottomBarContext = createContext<BottomBarContextType | undefined>(undefined);

// プロバイダ設定　プロバイダで囲んでコンテキストを共有
export function BottomBarProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [bottomBar, setBottomBar] = useState<React.ReactNode>([]);
    const [bottomBarHeight, setBottomBarHeight] = useState(40);

    return (
        <BottomBarContext.Provider value={{ bottomBar, setBottomBar, bottomBarHeight, setBottomBarHeight }}>
            {children}
        </BottomBarContext.Provider>
    );
}

// コンテキスト（メニューアイテム、セットメニューアイテム）取得関数
function useBottomBar() {
    const context = useContext(BottomBarContext);
    if (!context) throw new Error("useSubBar must be used within SubBarProvider");
    return context;
}

// サブバー取得（クライアントコンポーネントからの呼び出し）
export function useGetBottomBar() {
    const { bottomBar } = useBottomBar();

    return (bottomBar);
}

// サブバー取得（サーバコンポーネントからの呼び出し）
export function BottomBar() {
    const { bottomBar } = useBottomBar();

    if (bottomBar) return bottomBar;
    return (<></>);
}

// サブバー設定（クライアントコンポーネントからの呼び出し）
export function useSetBottomBar(
    node: React.ReactNode = null,
    deps: DependencyList = [],
    bgColor: string = "white",
    height: number = 40
) {
    const { setBottomBar, setBottomBarHeight } = useBottomBar();

    // useEffectを使ってレンダー実行
    useEffect(() => {
        setBottomBarHeight(height);

        setBottomBar(
            <div
                className="
                    fixed                       // 画面基準で固定位置
                    bottom-0                    // トップバーの下端から
                    left-0                      // 左端から0px
                    right-0                     // 右端から0px
                    //border-y                    // 上下にボーダーをつける
                    //flex                        // 中身をflexboxレイアウトにする
                    //items-center                // 縦方向中央揃え
                    //justify-between             // 中身を両端とその間に均等に配置
                    //px-1                        // 左右パディング 0.25rem(4px)
                    z-[40]                      // z-index                 
                "
                style={{ height: height, backgroundColor: bgColor }}
            >
                {node}
            </div>
        )

        return () => {
            setBottomBar(null);
            setBottomBarHeight(0);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

// サブバー設定（サーバコンポーネントからの呼び出し）
export function SetBottomBar(
    node: React.ReactNode = null,
    deps: DependencyList = [],
    bgColor: string = "white",
    height: number = 40
) {
    useSetBottomBar(node, deps, bgColor, height);

    return null;
}

// サブバーの高さ取得
export function useGetBottomBarHeight() {
    const { bottomBarHeight } = useBottomBar();

    return (bottomBarHeight);
}
