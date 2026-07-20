"use client"

/*
    アクション
    ＜概要＞
        画面内のメインアクションを実行するコンテキストプロバイダ。
    ＜使い方＞
        プロバイダ設定
            <ActionProvider>
                この中でメニューアイテム設定、メニューアイテム取得を実行
            </ActionProvider>
        アクション設定：
            useSetAction(node, bgColor, height);
                or
            <SetAction node={Node} bgColor={bgColor} height={height} />
        アクション取得：
            useGetAction();
    ＜注意＞
        useSetAction, useGetActionを使う際には"use client"が必要
*/

import { createContext, useState, useContext, useEffect, useCallback } from "react";

// コンテキストタイプ：登録処理と登録処理セットを共有
type ActionContextType = {
    action: (() => void) | null;
    setAction: React.Dispatch<React.SetStateAction<(() => void) | null>>;
    executeAction: (() => void) | undefined;
};

// コンテキスト設定
const ActionContext = createContext<ActionContextType | undefined>(undefined);

// プロバイダ設定　プロバイダで囲んでコンテキストを共有
export function ActionProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [action, setAction] = useState<(() => void) | null>(null);
    const executeAction = useCallback(() => {
        action?.();
    }, [action]);

    return (
        <ActionContext.Provider value={{ action, setAction, executeAction }}>
            {children}
        </ActionContext.Provider>
    );
}

// コンテキスト取得関数
function useAction() {
    const context = useContext(ActionContext);
    if (!context) throw new Error("useFoodListAddNewItemSubmit must be used within FoodListAddNewItemSubmitProvider");
    return context;
}

// アクション設定
export function useSetAction(formRef: React.RefObject<HTMLFormElement | null>) {
    const { setAction } = useAction();

    useEffect(() => {
        setAction(() => () => {
            formRef.current?.requestSubmit();
        });

        return () => {
            setAction(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export function SetAction(formRef: React.RefObject<HTMLFormElement | null>) {
    useSetAction(formRef);

    return null;
}

// アクション取得
export function useGetAction() {
    const { executeAction } = useAction();

    return (executeAction);
}
