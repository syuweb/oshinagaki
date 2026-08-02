"use client"

/*
    アクションプロバイダ
    ＜概要＞
        画面内のメインアクションを実行するコンテキストプロバイダ。
    ＜使い方＞
        プロバイダ設定
            <ActionProvider>
                この中でメニューアイテム設定、メニューアイテム取得を実行
            </ActionProvider>
*/

import type { ReactNode } from "react";
import { createContext, useState, useCallback } from "react";

// Contextで共有するデータの型定義
type ActionContextType = {
    registerAction: (action: () => void) => () => void;       // 実行する処理を登録する
    // registerActionは「引数なし、返値なしの関数action」が引数で、返値が「引数なし、返値なしの関数」の関数。関数定義：(引数) => 返値
    executeAction: () => void;                          // 登録された処理を実行する
    // 引数なし、返値なしの関数
};

// Contextを作成
export const ActionContext = createContext<ActionContextType | undefined>(undefined);
// createContext<contextの型>(初期値)：contextの型は上で定義したデータ型。初期値をundefinedにするため、| undefinedをつける。

// プロバイダ設定
// ActionProviderというReactコンポーネントを作る。
// 中に配置された子コンポーネント（children）を受け取り、それらにActionContextを提供する。
// childrenはReactで表示可能な任意の要素で、props(children)は変更不可。
export function ActionProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    // 実際に保持する処理。初期状態では未登録
    const [action, setAction] = useState<(() => void) | null>(null);
    // const [状態, 状態更新関数] = useState<型>(初期値);
    // 型：() => void | null　引数なし、返値なしの関数あるいはnull
    // 初期値：null

    // 処理登録関数（引数：引数なし返値なしの関数　返値：引数なし返値なしの関数）
    const registerAction = useCallback((action: () => void) => {    // 依存している値が変わらない限り、同じ関数を使い続ける
        // Reactのstateに、渡されたaction関数を保存する
        setAction(() => action);
        // setAction()は関数を引数にするとその関数の結果をactionにセットする
        // そのため、「actionを返す関数」を引数に与える。

        // 登録解除用の関数を返値とする
        return () => {
            setAction(null);
        };
    }, []);     // setActionは更新されないため、初回のみ実行で可

    // 処理実行関数
    const executeAction = useCallback(() => {       // 依存している値が変わらない限り、同じ関数を使い続ける
        action?.();                                 // actionがnullでなければ実行
    }, [action]);                                   // actionが更新されたらexecuteActionを作り直す

    return (
        <ActionContext.Provider value={{ registerAction, executeAction }}>
            {children}
        </ActionContext.Provider>
    );
}