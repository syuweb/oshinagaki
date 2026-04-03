"use client"
// FoodListのトップバー表示

import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Pulldown, PulldownButton, PulldownMenu, PulldownItem } from "@/components/Pulldown"
import { Sidemenu, SidemenuButton, SidemenuMenu, SidemenuItem } from "@/components/Sidemenu"
import { useGetTitle } from "@/components/Title"

export function TopBar() {
    const router = useRouter();
    const title = useGetTitle();    //ページタイトルの取得

    return (
        <div
            className="
                fixed                       // 画面基準で固定位置
                top-0                       // 上端から0px
                left-0                      // 左端から0px
                right-0                     // 右端から0px
                h-[var(--topbar-height)]    // 高さ指定
                bg-[var(--hilight-color)]   // 背景色指定
                border-b                    // 下側だけボーダーをつける
                flex                        // 中身をflexboxレイアウトにする
                items-center                // 縦方向中央揃え
                justify-between             // 中身を両端とその間に均等に配置
                px-1                        // 左右パディング 0.25rem(4px)
                z-30                        // z-index (他よりも全面に表示されやすい)
            "
        >
            {/* 左 */}
            <div
                className="
                    flex            // 中身をflexboxレイアウトにする
                    items-center    // 縦方向中央揃え
                "
            >
                {/* サイドメニュー */}
                <Sidemenu>
                    <SidemenuButton
                        className="
                            h-[var(--topbar-height)]    // 高さをトップバーの高さに合わせる
                            w-[var(--topbar-height)]    // 幅をトップバーの高さに合わせる
                        "
                    >
                        <Icon name="menu" size={32} />    {/* 三本線アイコン */}
                    </SidemenuButton>

                    <SidemenuMenu
                        className="
                            bg-[var(--half-color)]  // 背景色指定
                        "
                    >
                        <SidemenuItem onClick={()=>{router.push(`/foodlist`);}}>食事リスト</SidemenuItem>
                        <SidemenuItem onClick={()=>{router.push(`/dataedit`);}}>データ編集</SidemenuItem>
                    </SidemenuMenu>
                </Sidemenu>
            </div>

            {/* 中央 */}
            <div
                className="
                    flex            // 中身をflexboxレイアウトにする
                    items-center    // 縦方向中央揃え
                    justify-center  // 横方向中央揃え
                    font-medium     // フォントの太さを指定
                "
            >
                {title}
            </div>

            {/* 右 */}
            <div
                className="
                    flex            // 中身をflexboxレイアウトにする
                    items-center    // 縦方向中央揃え
                    justify-center  // 横方向中央揃え
                "
            >
                {/* プルダウンメニュー */}
                <Pulldown>
                    <PulldownButton
                        className="
                            h-[var(--topbar-height)]    // 高さをトップバーの高さに合わせる
                            w-[var(--topbar-height)]    // 幅をトップバーの高さに合わせる
                        "
                    >
                        <Icon name="more_horiz" size={32} />    {/* 三点リーダーアイコン */}
                    </PulldownButton>

                    <PulldownMenu
                        className="
                            bg-[var(--half-color)]  // 背景色指定
                        "
                    >
                        <PulldownItem>追加</PulldownItem>
                        <PulldownItem>編集</PulldownItem>
                    </PulldownMenu>
                </Pulldown>
            </div>
        </div>
    );
}
