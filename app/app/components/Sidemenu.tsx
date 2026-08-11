"use client";

/*
    サイドメニュー
    ＜概要＞
        サイドメニューを実装する。
        SidemenuButtonを押すとサイドメニューが表示され、SidemenuItemを選択すると指定した処理を実行してメニューを閉じる
        メニューを開いているときにメニューの外側を押すとメニューが閉じる。
    ＜使い方＞
        <Sidemenu>
            <SidemenuButton>
                ボタン
            </SidemenuButton>

            <SidemenuMenu>
                <SidemenuItem onClick=doItem1>Item1</SidemenuItem>
                <SidemenuItem onClick=doItem2>Item2</SidemenuItem>
            </SidemenuMenu>
        </Sidemenu>

        onClick：プルダウンメニューを選択したときに実行する関数。
        className：追加するCSSクラス。Tailwind CSSのクラスも指定できる。
*/

import type { ReactNode, Dispatch, SetStateAction, RefObject } from "react";
import { useState, createContext, useContext, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { Overlay } from "@/components/overlay";

// サイドメニューの共通プロパティ
type SidemenuComponentProps = {
    children: ReactNode;        // このレイアウト配下のページ内容が入る
    className?: string;         // 追加するCSSクラス。省略時は空文字
};

// サイドメニュー全体
export function Sidemenu({
    children,
    className = "",
}: SidemenuComponentProps) {
    // サイドメニューの開閉状態
    // Sidemenu全体で管理し、Contextを使って子コンポーネントから利用する
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
        // Sidemenu配下のコンポーネントからopen、setOpen、blockNextClickRefを利用できるようにする
        <SidemenuContext.Provider value={{ open, setOpen, blockNextClickRef }}>
            <div className={`${className}`}>
                {children}
            </div>
        </SidemenuContext.Provider>
    );
}

export function SidemenuButton({
    children,
    className = "",
}: SidemenuComponentProps) {
    // Contextからメニューの開閉状態と変更関数を取得
    const { setOpen } = useSidemenu();

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

export function SidemenuMenu({
    children,
    className = "",
}: SidemenuComponentProps) {
    // Contextからメニューの状態と
    // Overlayクリック時のイベント制御用refを取得
    const { open, setOpen, blockNextClickRef } = useSidemenu();

    // メニューが閉じているときは何も描画しない
    if (!open) return null;

    // createPortal：Reactのコンポーネント構造上はその場所に置いたまま、実際のHTMLを別の場所に描画するための機能
    // SidemenuMenuをSidemenuの子にしたまま、bodyに描画する
    return createPortal(
        <>
            {/* メニューの背後にOverlayを表示する。 */}
            {/* Overlayをクリックするとメニューを閉じる。 */}
            {/* blockNextClickRefには、Overlayクリック時に設定するrefを渡す。 */}
            <Overlay
                blockNextClickRef={blockNextClickRef}
                setOpen={setOpen}
            />

            {/* fixed：画面を基準に位置を固定 */}
            {/* top-[var(--topBar-height)]：TopBarと重ならないように上端をずらす */}
            {/* left-0：左端まで広げる */}
            {/* w-[300px]：横幅 */}
            {/* h-[calc(100dvh-var(--topBar-height))]：高さは画面の高さからTopBar分を引く */}
            {/* flex：Flexbox */}
            {/* flex-col：縦方向に並べる */}
            {/* bg-[var(--half-color)]：背景色 */}
            {/* shadow-lg：影 */}
            {/* z-[100]：重なり順 */}
            {/* e.stopPropagation()：メニュー本体をクリックしたとき、Overlay側へクリックを伝播させない */}
            <div
                className={`
                    fixed top-[var(--topBar-height)] left-0 w-[300px] h-[calc(100dvh-var(--topBar-height))]
                    flex flex-col bg-[var(--half-color)] shadow-lg
                    z-[100]
                    ${className}
                `}


                onPointerDown={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </>,
        // 描画する場所の指定。body直下に描画する
        // Portalを使うことで、親要素のレイアウトの影響を受けにくくする
        document.body
    );
}

// サイドメニュー項目のプロパティ
type SidemenuItemProps = SidemenuComponentProps & {
    onClick?: () => void;       // 項目を選択したときに実行する処理
};

export function SidemenuItem({
    children,
    onClick,
    className = "",
}: SidemenuItemProps) {
    // Contextからメニューを閉じるための関数を取得
    const { setOpen } = useSidemenu();

    // メニュー項目を選択したときの処理
    function handleClick() {
        // 利用者が指定した処理を実行
        onClick?.();

        // 処理が終わったらメニューを閉じる
        setOpen(false);
    }

    return (
        // px-2：左右にpaddingを設定
        // py-1：上下にpaddingを設定
        // w-full：親要素いっぱいの幅にする
        // border-b：下側にborderを表示
        // last:border-b-0：最後の項目だけborderを消す
        // text-left：テキストを左揃えにする
        // break-words：長い文字列を途中で改行可能にする
        <button
            onClick={handleClick}

            className={`
                px-2 py-1 w-full
                border-b last:border-b-0
                text-left break-words
                ${className}
            `}
        >
            {children}
        </button>
    );
}

// メニューの開閉状態などをサイドメニュー全体で共有するためのコンテキストタイプ
type SidemenuContextType = {
    // サイドメニューの開閉状態
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

// サイドメニュー内部で共有するコンテキストを作成
const SidemenuContext = createContext<SidemenuContextType | undefined>(undefined);

// コンテキストからサイドメニューの状態を取得する
//
// SidemenuButton、SidemenuMenu、SidemenuItem は
// SidemenuContext.Provider の中で使用する必要がある。
function useSidemenu() {
    const ctx = useContext(SidemenuContext);

    // Sidemenuの外でSidemenuButton/Menu/Itemを使用した場合はエラーにする
    if (!ctx) {
        throw new Error(
            "Sidemenu components must be inside <Sidemenu>"
        );
    }

    return ctx;
}
