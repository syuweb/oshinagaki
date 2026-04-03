"use client"

/*
    サイドメニュー
    ＜概要＞
        サイドメニューを実装する。
        ボタンを押すとサイドメニューが表示され、メニューが選択可能。
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

        onClick：サイドメニュー選択時の実行関数
        className：TailwindのclassNameをそのまま指定できる（上記すべてのコンポーネントで利用可能）
*/

import { useState, createContext, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Overlay } from "@/components/overlay"

// メニュー開閉状態、イベント伝播制御状態をプルダウン全体で共有するためのコンテキストタイプ
type SidemenuContextType = {
    open: boolean;
    setOpen: (v: boolean) => void;
    blockNextClickRef: React.RefObject<boolean>;
}

// コンテキスト作成
const SidemenuContext = createContext<SidemenuContextType | null>(null);

// コンテキスト取得関数
function useSidemenu() {
    const ctx = useContext(SidemenuContext);
    if (!ctx) throw new Error("Sidemenu components must be inside <Sidemenu>");
    return ctx;
}

// サイドメニュー
type SidemenuProps = {
    children: React.ReactNode;
    className?: string;
};

export function Sidemenu({ children, className }: SidemenuProps) {
    const [open, setOpen] = useState(false);    // open, setOpenは一番外側で設定
    const blockNextClickRef = useRef(false);    // 一番外側で設定

    // サイドメニュー表示時に画面がスクロールしないようにする
    useEffect(() => {  // メニュー開閉時に実行
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
        <SidemenuContext.Provider value={{ open, setOpen, blockNextClickRef }}>    {/* メニュー開閉共有のためのプロバイダ */}
            <div className={`${className}`}>
                {children}
            </div>
        </SidemenuContext.Provider>
    );
}

// サイドメニューボタン
type SidemenuButtonProps = {
    children: React.ReactNode;
    className?: string;
};

export function SidemenuButton({ children, className }: SidemenuButtonProps) {
    const { open, setOpen } = useSidemenu();

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

// サイドメニューのメニュー
type SidemenuMenuProps = {
    children: React.ReactNode;
    className?: string;
};

export function SidemenuMenu({ children, className }: SidemenuMenuProps) {
    const { open, setOpen, blockNextClickRef } = useSidemenu();

    if (!open) return null; // 閉じているときは何も表示しない

    return createPortal(    // コンポーネント構造はそのまま、描画位置だけ変える
        <>
            <Overlay
                clickRef={blockNextClickRef}
                open={setOpen}
            />
            {/* メニュー表示 */}
            <div
                className={`
                    fixed                                   // 描画位置固定
                    flex flex-col                           // flexboxレイアウトにして縦に並べる
                    top-[var(--topbar-height)]              // トップバーと重ならないように画面上部をパディング
                    left-0                                  // 左のパディングは0
                    w-[300px]                               // メニューの幅を300pxにする
                    h-[calc(100dvh-var(--topbar-height))]   // 高さ指定：画面100%からトップバーの高さを引く
                    bg-[var(--half-color)]                  // 背景色指定
                    z-[60]                                  // Z位置を60に
                    shadow-lg                               // 影のサイズをlg(大き目)にする
                    ${className}
                `}
                onPointerDown={(e) => e.stopPropagation()} // メニュー内（itemのない部分）クリックは閉じない
            >
                {children}
            </div>
        </>,
        document.body   // ここに描画
    );
}

// メニューアイテム
type SidemenuItemProps = {
    children: React.ReactNode;
    onClick?: () => void;       //クリック時のハンドラ
    className?: string;
};

export function SidemenuItem({ children, onClick, className }: SidemenuItemProps) {
    const { setOpen } = useSidemenu();

    // ハンドラ設定。指定されたハンドラ実行後、メニューを閉じる。
    function handleClick() {
        onClick?.();
        setOpen(false);
    }

    return (
        <button
            onClick={handleClick}   // 設定したハンドラを指定
            className={`
                px-2                // 横方向のパディングを2に
                py-1                // 縦方向のパディングを1に
                w-full              // 幅はメニュー幅に合わせる
                text-left           // テキスト左揃え
                border-b            // 下側に枠線を表示
                last:border-b-0     // 一番最後のアイテムは枠線なし
                break-words         // テキストは改行してもよい
                ${className}
            `}
        >
            {children}
        </button>
    );
}