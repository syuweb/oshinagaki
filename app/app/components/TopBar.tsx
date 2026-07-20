"use client"

/*
    トップバー
    ＜概要＞
        トップバーを実装する。
        左にサイドメニュー、右にプルダウンメニューを表示するボタンを配置し、
        中央にはタイトルを表示する。
        サイドメニューの内容は固定だが、プルダウンメニュー、タイトルは変更可能。
    ＜使い方＞
        プルダウンメニュー設定：
          MenuItems.tsx参照
        タイトル設定：
          Title.tsx参照
        トップバー表示：
          <TopBar />
*/

import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Pulldown, PulldownButton, PulldownMenu, PulldownItem } from "@/components/Pulldown"
import { Sidemenu, SidemenuButton, SidemenuMenu, SidemenuItem } from "@/components/Sidemenu"
import { useGetTitle } from "@/components/Title"
import { useGetMenuItems } from "@/components/MenuItems"

export function TopBar() {
    const router = useRouter();
    const title = useGetTitle();            //ページタイトルの取得
    const menuItems = useGetMenuItems();    // メニューアイテムの取得

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
                z-[60]                      // z-index
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

                    {/* メニューアイテムの登録 */}
                    <SidemenuMenu
                        className="
                            bg-[var(--half-color)]  // 背景色指定
                        "
                    >
                        <SidemenuItem onClick={() => { router.push(`/foodlist`); }}>食事リスト</SidemenuItem>
                        {/*<SidemenuItem onClick={() => { router.push(`/dataedit`); }}>データ編集</SidemenuItem>*/}
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

                    {/* メニューアイテムの登録 */}
                    <PulldownMenu
                        className="
                            bg-[var(--half-color)]  // 背景色指定
                        "
                    >
                        {menuItems.map((item, i) => (
                            <PulldownItem key={i} onClick={item.onClick}>
                                {item.name}
                            </PulldownItem>
                        ))}
                    </PulldownMenu>
                </Pulldown>
            </div>
        </div>
    );
}
