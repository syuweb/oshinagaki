/*
    オーバーレイ
    ＜概要＞
        オーバーレイを実装する。
        画面上に半透明のフィルターを表示し、その下にある画面を操作できないようにする。
        オーバーレイより上（z-indexが大きい）に表示された要素だけを操作可能にしたい場合に使用する。
        z-index：80
    ＜使い方＞
        <Overlay
            blockNextClickRef={blockNextClickRef}
            setOpen={setOpen}
        />

        blockNextClickRef：オーバーレイがクリックされたことを呼び出し元に通知するためのRef。
                          PointerDown時にcurrentをtrueに設定する。
        setOpen：オーバーレイがクリックされたときに呼び出す関数。
                 falseを渡して、表示中のメニューなどを閉じる。
*/

import type { RefObject } from "react";

type Props = {
    // オーバーレイがクリックされたことを通知するRef
    blockNextClickRef: RefObject<boolean>;

    // オーバーレイがクリックされたときに呼び出す関数
    // falseを渡してメニューなどを閉じる
    setOpen: (b: boolean) => void;
};

export function Overlay({
    blockNextClickRef,
    setOpen,
}: Props) {
    return (
        // fixed：画面に対して固定位置で表示
        // top-[var(--topBar-height)]：TopBarと重ならないように上端をずらす
        // right-0：右端まで広げる
        // bottom-0：下端まで広げる
        // left-0：左端まで広げる
        // z-[80]：z-indexを80に設定
        // bg-black/20：黒色を20%の不透明度で表示
        // onPointerDown：押した瞬間に発生するイベント
        // e：Reactから渡されるイベントオブジェクト。今回の場合、Pointer Eventに関する情報を持つ
        <div
            className="
                fixed top-[var(--topBar-height)] right-0 bottom-0 left-0
                bg-black/20
                z-[80]
            "
            onPointerDown={(e) => {
                e.preventDefault();

                // PointerDownの後に発生するClickをブロックするためのフラグを設定
                // （iPhoneなどではPointerDownの後にClickが発生するため）
                blockNextClickRef.current = true;

                // メニューなどを閉じる
                setOpen(false);
            }}
        />
    );
}
