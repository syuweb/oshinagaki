"use client"

/*
    アクションカスタムフック
    ＜概要＞
        画面内のメインアクションを取得・設定するカスタムフック。
    ＜使い方＞
        アクション設定：
            const unregisterAction = useSetAction(Action関数);
        アクション取得：
            const executeAction = useGetAction();
*/

import type { RefObject } from "react";
import { useContext, useEffect } from "react";

import { ActionContext } from "@/providers/ActionProvider";

// フォーム送信処理をActionProviderに登録するカスタムフック
// RefObject：useRefで作ったrefオブジェクト
// HTMLFormElement：参照先はformの要素
// null：最初のレンダリング時点ではまだDOM要素が存在しない可能性があるため
export function useSetAction(
    formRef: RefObject<HTMLFormElement | null>
) {
    // ActionContextからアクション登録関数を取得
    const { registerAction } = useAction();

    // コンポーネントが表示されたときに初回実行される
    // その後は依存配列の要素の値が変わったときに実行される
    // コンポーネントの表示が解除された（他のページに移った等）らreturnが実行される
    useEffect(() => {
        // フォーム送信処理をActionProviderへ登録
        // executeAction()が呼ばれると、この関数が実行される
        const unregister = registerAction(() => {           // unregisterに解除関数を返す
            // form要素のsubmitイベントを発生させる
            formRef.current?.requestSubmit();               // requestSubmit()：onSubmitに指定された関数を呼ぶ
        });

        // コンポーネントがアンマウントされたら登録を解除
        return unregister;
    }, [registerAction, formRef]);      // registerActionは変更されない。formRefは初期値nullから実際の値に変更される。
}

// 登録済みアクションを実行する関数を取得するフック
export function useGetAction() {
    // ActionContextからアクション実行関数を取得
    const { executeAction } = useAction();

    return executeAction;
}

// ActionContextを取得する共通フック
function useAction() {
    // Contextから値を取得
    const context = useContext(ActionContext);

    // ActionProviderの外で使われた場合はエラーにする
    if (!context) {
        throw new Error(
            "useSetAction/useGetAction must be used within ActionProvider"
        );
    }

    return context;
}