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
import { Pulldown, PulldownButton, PulldownMenu, PulldownItem } from "@/components/Pulldown";
import { Sidemenu, SidemenuButton, SidemenuMenu, SidemenuItem } from "@/components/Sidemenu";
import { useGetMenuItems } from "@/hooks/useMenuItems";
import { useGetTitle } from "@/hooks/useTitle";

export function TopBar() {
    // Next.jsのルーターを取得
    // router.push()による画面遷移や、router.back()による前のページへの移動に使用する
    const router = useRouter();

    // Contextから現在のページタイトルを取得
    const title = useGetTitle();

    // Contextから現在のプルダウンメニュー項目を取得
    const menuItems = useGetMenuItems();

    return (
        // トップバー全体
        // fixed：画面を基準に位置を固定
        // top-0：画面上端から0px
        // left-0：画面左端から0px
        // right-0：画面右端から0px
        // h-[var(--topBar-height)]：トップバーの高さをCSS変数で指定
        // bg-[var(--hilight-color)]：背景色をCSS変数で指定
        // border-b：下側だけにボーダーを付ける
        // flex：子要素をFlexboxで配置
        // items-center：子要素を縦方向中央に配置
        // justify-between：子要素を左右端に配置し、その間を均等に広げる
        // px-1：左右に0.25rem（4px）の内側余白を設定
        // z-[60]：z-indexを60に設定し、他の要素より前面に表示
        <div
            className="
                fixed top-0 left-0 right-0 h-[var(--topBar-height)]
                bg-[var(--hilight-color)] border-b
                flex items-center justify-between
                px-1
                z-[60]
            "
        >
            {/* 左：サイドメニューと戻るボタン */}
            {/* flex：子要素をFlexboxで配置 */}
            {/* items-center：子要素を縦方向中央に配置 */}
            <div
                className="
                    flex items-center
                "
            >
                {/* サイドメニュー */}
                <Sidemenu>
                    {/* サイドメニューを開くボタン */}
                    {/* h-[var(--topBar-height)]：ボタンの高さをトップバーの高さに合わせる */}
                    {/* w-[var(--topBar-height)]：ボタンの幅をトップバーの高さに合わせ、正方形にする */}
                    <SidemenuButton
                        className="
                            h-[var(--topBar-height)] w-[var(--topBar-height)]
                        "
                    >
                        {/* 三本線アイコン */}
                        <Icon name="menu" size={32} />
                    </SidemenuButton>

                    {/* サイドメニューの項目 */}
                    {/* サイドメニューの項目はアプリ内で固定 */}
                    {/* bg-[var(--half-color)]：背景色をCSS変数で指定 */}
                    <SidemenuMenu
                        className="
                            bg-[var(--half-color)]
                        "
                    >
                        {/* 食事リストへ移動 */}
                        <SidemenuItem
                            onClick={() => {
                                router.push("/foodlist");
                            }}
                        >
                            食事リスト
                        </SidemenuItem>

                        {/* データ編集 */}
                        {/* データ編集はメンテナンス用のため、通常はコメントアウトし、必要なときにコメントを外す */}
                        {/*
                        <SidemenuItem
                            onClick={() => {
                                router.push("/dataedit");
                            }}
                        >
                            データ編集
                        </SidemenuItem>
                        */}
                    </SidemenuMenu>
                </Sidemenu>

                {/* 直前に表示していたページへ戻る */}
                {/* flex：中身をFlexboxレイアウトにする */}
                {/* items-center：中身を縦方向中央に配置 */}
                {/* justify-center：中身を横方向中央に配置 */}
                <button
                    onClick={() => router.back()}
                    className="
                        flex items-center justify-center
                    "
                >
                    {/* 戻るアイコン */}
                    <Icon name="arrow_back_ios" size={24} />
                </button>
            </div>


            {/* 中央：ページタイトル */}
            {/* flex：中身をFlexboxレイアウトにする */}
            {/* items-center：中身を縦方向中央に配置 */}
            {/* justify-center：中身を横方向中央に配置 */}
            {/* font-medium：フォントの太さをmediumにする */}
            {/* min-w-0：Flexアイテムが必要に応じて縮小できるようにする */}
            {/*          子要素の合計が親より大きくなった場合への対策 */}
            {/* truncate：文字が領域からはみ出す場合に「…」で省略する */}
            <div
                className="
                    min-w-0
                    flex items-center justify-center
                    font-medium
                    truncate
                "
            >
                {title}
            </div>

            {/* 右：プルダウンメニュー */}
            {/* flex：中身をFlexboxレイアウトにする */}
            {/* items-center：中身を縦方向中央に配置 */}
            {/* justify-center：中身を横方向中央に配置 */}
            <div
                className="
                    flex items-center justify-center
                "
            >
                {/* プルダウンメニュー */}
                <Pulldown>
                    {/* プルダウンメニューを開くボタン */}
                    {/* h-[var(--topBar-height)]：ボタンの高さをトップバーの高さに合わせる */}
                    {/* w-[var(--topBar-height)]：ボタンの幅をトップバーの高さに合わせ、正方形にする */}
                    <PulldownButton
                        className="
                            h-[var(--topBar-height)] w-[var(--topBar-height)]
                        "
                    >
                        {/* 三点リーダーアイコン */}
                        <Icon name="more_horiz" size={32} />
                    </PulldownButton>

                    {/* プルダウンメニューの項目 */}
                    {/* bg-[var(--half-color)]：背景色をCSS変数で指定 */}
                    <PulldownMenu
                        className="
                            bg-[var(--half-color)]
                        "
                    >
                        {/* メニュー項目を1件ずつ取り出してPulldownItemを生成 */}
                        {/* {} で囲むことで、JavaScriptの式を実行して、その結果を画面に表示 */}
                        {/* map()：配列を先頭から1件ずつ処理して、新しい配列を作るJavaScriptのメソッド */}
                        {/* (item, i)　map()が渡してくれる値（第3引数は使わないので省略されている */}
                        {/* 　　　　　　第1引数：配列の要素 */}
                        {/* 　　　　　　第2引数：配列のインデックス */}
                        {/* 　　　　　　第3引数：配列そのもの */}
                        {/* key={i}：Reactがリストの各項目を識別するためのキー */}
                        {/* onClick={item.onClick}：メニュー項目がクリックされたときに実行する関数 */}
                        {menuItems.map((item, i) => (
                            <PulldownItem
                                key={i}
                                onClick={item.onClick}
                            >
                                {/* メニューに表示する名前 */}
                                {item.name}
                            </PulldownItem>
                        ))}
                    </PulldownMenu>
                </Pulldown>
            </div>
        </div>
    );
}
