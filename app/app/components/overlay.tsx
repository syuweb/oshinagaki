/*
    オーバーレイ
    ＜概要＞
        オーバーレイを実装する。
        半透明なフィルターで画面全体を覆い、その下の画面の操作ができないようにする。
        オーバーレイよりも上に表示したものだけが操作できるようにするときに使用する。
        z位置は50。
    ＜使い方＞
        <Overlay
            clickRef={blockNextClickRef}
            open={setOpen}
        />

        clickRef：オーバーレイがクリックされた(clickRef.current=true)ことを通知する。
        open：オーバーレイがクリックされたときの動作を指定する。
*/

type props = {
    clickRef: React.RefObject<boolean>;
    open: (b: boolean) => void;
}

export function Overlay({ clickRef, open }: props) {
    return (
        <div
            className="
                    fixed                       // 描画位置固定
                    inset-0                     // 上下左右のパディングを0にする（画面いっぱいになる）
                    top-[var(--topbar-height)]  // トップバーと重ならないように画面上部をパディング
                    z-[80]                      // z位置を50に
                    bg-black/20                 // 黒色を20%の透明度で表示
                "
            onPointerDown={(e) => {
                e.preventDefault();

                clickRef.current = true;    //次のclickをブロック（iPhoneタップではPointerDownの後にClickが発生）
                open(false);                //メニューを閉じる（メニュー外タップ）
            }}
        />
    );
}
