"use client"

/*
    プルダウンメニュー

    ＜概要＞
        ボタンを押すとプルダウンメニューを表示する。
        メニュー項目を選択すると、指定された処理を実行してメニューを閉じる。
        メニューを開いているときにメニューの外側を押すとメニューを閉じる。

    ＜使い方＞
        ボタンとメニューを Pulldown で囲む。

        <Pulldown>
            <PulldownButton>
                ...
            </PulldownButton>

            <PulldownMenu>
                <PulldownItem onClick={doItem1}>Item1</PulldownItem>
                <PulldownItem onClick={doItem2}>Item2</PulldownItem>
            </PulldownMenu>
        </Pulldown>

        onClick：プルダウンメニューを選択したときに実行する関数。
        className：追加するCSSクラス。Tailwind CSSのクラスも指定できる。
*/

import type { ReactNode, Dispatch, SetStateAction, RefObject } from "react";
import { useState, createContext, useContext, useRef, useLayoutEffect } from "react";

import { Overlay } from "@/components/overlay";

// プルダウンの共通プロパティ
type PulldownComponentProps = {
    children: ReactNode;        // このレイアウト配下のページ内容が入る
    className?: string;         // 追加するCSSクラス。省略時は空文字
};

// プルダウン全体
export function Pulldown({
    children,
    className = "",
}: PulldownComponentProps) {
    // メニューが開いているかどうかを管理する状態
    const [open, setOpen] = useState(false);

    // Overlay をクリックした直後のクリックイベントを外側の要素へ伝播させないためのフラグ
    // useStateではなくuseRefを使うことで、値を変更しても再レンダーしない。
    const blockNextClickRef = useRef(false);

    // メニュー表示中は画面全体をスクロールできないようにする。
    // useEffectは画面描画後に呼ばれる。画面描画前に呼びたい場合はuseLayoutEffectを使う。
    // ここでは画面描画時にはスクロールできないようにしたいため、useLayoutEffectを使う。
    useLayoutEffect(() => {
        // メニューが閉じているときは何もしない
        if (!open) return;

        // メニューを開く前のbodyのoverflow設定を保存
        //      document：HTML全体
        //      document.body：HTMLの<body>要素
        //      document.body.style：<body>に直接指定されているCSSをJavaScriptから操作するためのもの
        const original = document.body.style.overflow;

        // bodyのスクロールを禁止
        document.body.style.overflow = "hidden";

        // openがfalseになったとき、元の設定に戻す
        // returnでcleanupを登録する
        // cleanupは「次のEffectが実行される前」または「コンポーネントが破棄されるとき」に呼ばれる
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    // Overlayをクリックした直後に、そのクリックが背後にあるボタンなどへ伝わるのを防ぐ。
    // 第3引数をtrueにしてcaptureフェーズ（構成要素でonClick()が処理される前）でイベントを取得する。
    // ここでは画面描画時にはクリックの伝播を止めたいため、useLayoutEffectを使う。
    useLayoutEffect(() => {
        // クリック時に呼ばれるハンドラの設定
        function handleClick(e: MouseEvent) {
            // Overlay側で「次のクリックを止める」指定がされている場合
            if (blockNextClickRef.current) {
                // クリックイベントを他の要素へ伝播させない
                e.stopPropagation();

                // ブラウザの標準動作もキャンセルする
                e.preventDefault();

                // 1回処理したらフラグを解除する
                blockNextClickRef.current = false;
            }
        }

        // true：documentのcaptureフェーズでクリックイベントを監視する
        // captureフェーズ：構成要素のonClick()より前に処理される
        document.addEventListener("click", handleClick, true);

        // コンポーネント破棄時にイベント監視を解除する
        return () => {
            document.removeEventListener("click", handleClick, true);
        };
    }, []);

    return (
        // Pulldown配下のコンポーネントからopen、setOpen、blockNextClickRefを利用できるようにする
        <PulldownContext.Provider value={{ open, setOpen, blockNextClickRef }}>
            {/* relative：absolute配置するメニューの位置の基準にする */}
            <div className={`relative ${className}`}>
                {children}
            </div>
        </PulldownContext.Provider>
    );
}

// プルダウンを開閉するボタン
export function PulldownButton({
    children,
    className = "",
}: PulldownComponentProps) {
    // Contextからメニューの開閉状態と変更関数を取得
    const { setOpen } = usePulldown();

    return (
        // 現在の状態を反転してメニューを開閉する
        // ボタンがクリックされたら、openを現在の値の反対に変更する
        // prev => !prev：現在のopenを受け取って、その反対を返す関数(prevはどんな名前でもよい)
        <button
            onClick={() => setOpen(prev => !prev)}
            className={`
                flex items-center justify-center
                ${className}
            `}
        >
            {children}
        </button>
    );
}

// プルダウンメニュー
export function PulldownMenu({
    children,
    className = "",
}: PulldownComponentProps) {
    // Contextからメニューの状態と
    // Overlayクリック時のイベント制御用refを取得
    const { open, setOpen, blockNextClickRef } = usePulldown();

    // メニューが閉じているときは何も描画しない
    if (!open) return null;

    return (
        <>
            {/* メニューの背後にOverlayを表示する。 */}
            {/* Overlayをクリックするとメニューを閉じる。 */}
            {/* blockNextClickRefには、Overlayクリック時に設定するrefを渡す。 */}
            <Overlay
                blockNextClickRef={blockNextClickRef}
                setOpen={setOpen}
            />

            {/* absolute：親要素を基準に配置 */}
            {/* flex：Flexbox */}
            {/* flex-col：縦方向に並べる */}
            {/* right-0：親要素の右端に合わせる */}
            {/* min-w-fit：内容に合わせた最小幅 */}
            {/* whitespace-nowrap：テキストを改行しない */}
            {/* bg-[var(--half-color)]：背景色 */}
            {/* border：枠線 */}
            {/* shadow：影 */}
            {/* z-[100]：重なり順 */}
            <div
                className={`
                    absolute right-0
                    flex flex-col
                    min-w-fit whitespace-nowrap bg-[var(--half-color)] border shadow
                    z-[100]
                    ${className}
                `}
            >
                {children}
            </div>
        </>
    );
}

// プルダウン項目のプロパティ
type PulldownItemProps = PulldownComponentProps & {
    onClick?: () => void;       // 項目を選択したときに実行する処理
};

// プルダウンの各メニュー項目
export function PulldownItem({
    children,
    onClick,
    className = "",
}: PulldownItemProps) {
    // Contextからメニューを閉じるための関数を取得
    const { setOpen } = usePulldown();

    // メニュー項目を選択したときの処理
    function handleClick() {
        // 利用者が指定した処理を実行
        onClick?.();

        // 処理が終わったらメニューを閉じる
        setOpen(false);
    }

    return (
        // px-5：左右の余白
        // py-1：上下の余白
        // w-full：親要素いっぱいの幅
        // truncate：文字が領域からはみ出す場合に「…」で省略する
        // text-left：テキストを左揃え
        // max-w-[250px]：最大幅
        // border-b：下側に枠線
        // last:border-b-0：最後の項目だけ下側の枠線を消す
        <button
            onClick={handleClick}
            className={`
                px-5 py-1 w-full
                text-left max-w-[250px] truncate
                border-b last:border-b-0
                ${className}
            `}
        >
            {children}
        </button>
    );
}

// メニューの開閉状態などをプルダウン全体で共有するためのコンテキストタイプ
type PulldownContextType = {
    // プルダウンの開閉状態
    open: boolean;

    // メニューの開閉状態を変更する関数
    // setOpenには、ReactのuseStateが返すsetterと同じ種類の関数を入れる
    // SetStateAction<boolean>：booleanそのもの、またはbooleanを受け取ってbooleanを返す関数
    // Dispatch<>：指定された型の値を受け取る関数
    setOpen: Dispatch<SetStateAction<boolean>>;

    // Overlay がクリックされた直後のクリックイベントをPulldownの外側へ伝播させないためのフラグ
    // RefObject<boolean>：booleanを参照するRefオブジェクト
    blockNextClickRef: RefObject<boolean>;
};

// プルダウン内部で共有するコンテキストを作成
const PulldownContext = createContext<PulldownContextType | undefined>(undefined);

// コンテキストからプルダウンの状態を取得する
//
// PulldownButton、PulldownMenu、PulldownItem は
// PulldownContext.Provider の中で使用する必要がある。
function usePulldown() {
    const ctx = useContext(PulldownContext);

    if (!ctx) {
        throw new Error(
            "Pulldown components must be inside <Pulldown>"
        );
    }

    return ctx;
}
