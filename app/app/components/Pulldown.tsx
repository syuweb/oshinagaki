"use client"

/*
    プルダウンメニュー
    ＜概要＞
        プルダウンメニューを実装する。
        ボタンを押すとプルダウンメニューが表示され、メニューが選択可能。
        メニューを開いているときにメニューの外側を押すとメニューが閉じる。
    ＜使い方＞
        <Pulldown>
            <PulldownButton>
                ボタン
            </PulldownButton>

            <PulldownMenu>
                <PulldownItem onClick=doItem1>Item1</PulldownItem>
                <PulldownItem onClick=doItem2>Item2</PulldownItem>
            </PulldownMenu>
        </Pulldown>

        onClick：プルダウンメニュー選択時の実行関数
        className：TailwindのclassNameをそのまま指定できる（上記すべてのコンポーネントで利用可能）
*/

import { useState, createContext, useContext, useEffect, useRef } from "react";
import { Overlay } from "@/components/overlay"

// メニュー開閉状態をプルダウン全体で共有するためのコンテキストタイプ
type PulldownContextType = {
    open: boolean;
    setOpen: (v: boolean) => void;
    blockNextClickRef: React.RefObject<boolean>;
}

// コンテキスト作成
const PulldownContext = createContext<PulldownContextType | null>(null);

// コンテキスト（メニュー開閉状態）取得関数
function usePulldown() {
    const ctx = useContext(PulldownContext);
    if (!ctx) throw new Error("Dropdown components must be inside <Dropdown>");
    return ctx;
}

// プルダウン
type PulldownProps = {
    children: React.ReactNode;
    className?: string;
};

export function Pulldown({ children, className }: PulldownProps) {
    const [open, setOpen] = useState(false);    // open, setOpenは一番外側で設定
    const blockNextClickRef = useRef(false);    // 一番外側で設定

    // サイドメニュー表示時に画面がスクロールしないようにする
    useEffect(() => {
        if (!open) return;  //メニューが開いていないときは何もしない

        const original = document.body.style.overflow;  // 現在のoverflow設定を保持　overflow:画面外をスクロールして表示、隠す、など
        document.body.style.overflow = "hidden";        // overflow=hidden：画面外は隠す（スクロールしない）

        return () => {
            document.body.style.overflow = original;    // 保持していた設定に戻す
        };
    }, [open])

    // メニュー外タップ時にタップしたところのボタンが押されないようにする（iPhone対応）
    useEffect(() => {   // 初回レンダー時に１回だけ実行
        // クリック時に実行されるハンドラ設定。自身のクリックだけを検知して他に伝播させない
        function handleClick(e: MouseEvent) {
            if (blockNextClickRef.current) {        // メニュー外(overlay)が押されたとき（押されたときにtrueにする）
                e.stopPropagation();                // イベントの伝播を止める
                e.preventDefault();                 // ブラウザの標準動作を止める（遷移、スクロールなど）
                blockNextClickRef.current = false;  // 上記規制は1回(外側クリック)のみ
            }
        }

        document.addEventListener("click", handleClick, true);  //他に伝播する前の処理トップ(document)にハンドラを設定。true:タップ開始時

        return () => {
            document.removeEventListener("click", handleClick, true);   //コンポーネント破棄時にイベント削除
        };
    }, []);

    return (
        <PulldownContext.Provider value={{ open, setOpen, blockNextClickRef }}>    {/* メニュー開閉共有のためのプロバイダ */}
            <div
                className={`
                    relative        //メニュー表示の基準
                    ${className}
                `}
            >
                {children}
            </div>
        </PulldownContext.Provider>
    );
}

// プルダウンボタン
type PulldownButtonProps = {
    children: React.ReactNode;
    className?: string;
};

export function PulldownButton({ children, className }: PulldownButtonProps) {
    const { open, setOpen } = usePulldown();

    return (
        <button
            onClick={() => setOpen(!open)}  // ボタンを押したらメニュー開閉
            className={`
                flex                // 中身をflexboxレイアウトにする
                items-center        // 縦方向中央揃え
                justify-center      // 横方向中央揃え
                ${className}
            `}
        >
            {children}
        </button>
    );
}

// プルダウンメニュー
type PulldownMenuProps = {
    children: React.ReactNode;
    className?: string;
};

export function PulldownMenu({ children, className }: PulldownMenuProps) {
    const { open, setOpen, blockNextClickRef } = usePulldown();

    if (!open) return null; // 閉じているときは何も表示しない

    return (
        <>
            <Overlay
                clickRef={blockNextClickRef}
                open={setOpen}
            />
            <div
                className={`
                absolute                // 描画位置を親(relative)に合わせる
                flex flex-col           // flexboxレイアウトにして縦に並べる
                right-0                 // 親(relative)と右端を泡エル
                min-w-fit               // 幅を文字幅に合わせる
                bg-[var(--half-color)]  // 背景色指定
                border                  // 枠表示
                shadow                  // 影をつける
                whitespace-nowrap       // テキストの改行を禁止
                z-[60]                  // Z位置を60に
                ${className}
            `}
            >
                {children}
            </div>
        </>
    );
}

type PulldownItemProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
};

// メニューアイテム
export function PulldownItem({ children, onClick, className }: PulldownItemProps) {
    const { setOpen } = usePulldown();

    // ハンドラ設定。指定されたハンドラ実行後、メニューを閉じる。
    function handleClick() {
        onClick?.();
        setOpen(false);
    }

    return (
        <button
            onClick={handleClick}
            className={`
                px-5                // 横方向のパディングを5に
                py-1                // 縦方向のパディングを1に
                w-full              // 幅はメニュー幅に合わせる
                text-left           // テキストは左揃え
                break-words         // テキストは改行してもよい
                border-b            // 下側に枠線を表示
                last:border-b-0     // 最後の項目は枠線を非表示
                ${className}
            `}
        >
            {children}
        </button>
    );
}