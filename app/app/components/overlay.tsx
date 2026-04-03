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
                    z-[50]                      // z位置を9999に
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
