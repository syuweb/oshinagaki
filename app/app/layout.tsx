/*
    layout.tsx
    ＜概要＞
        アプリ全体のレイアウト指定。
          アプリ画面：上部にトップバー、サブバー、下部にボトムバー、他はメイン領域
                サブバーとボトムバーはページごとに表示／非表示切り替え可能
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

import { AppProvider } from "@/components/AppProvider";
import { BottomBar } from "@/components/BottomBar";
import { ContentArea } from "@/components/ContentArea";
import { SubBar } from "@/components/SubBar";
import { TopBar } from "@/components/TopBar";

// Geistフォントの設定
const geistSans = Geist({
  variable: "--font-geist-sans",  // CSS変数名。この名前でTailwindやCSSからフォントを利用できる
  subsets: ["latin"],             // 読み込む文字セット。"latin" はGeistの場合、英数字や記号のみを読み込む。日本語は含まれない
});                               // weight(太さ)を省略した場合は 「weight: ["400"],」になる。400=font-normal, 700=font-bold

// Geist_Monoフォント(等幅)の設定（コード表示用など）
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ページのメタ情報（タイトルや説明など）を定義する
export const metadata: Metadata = {                  // Next.jsが各ページから使えるようにexportする
  title: "おしながき",                                // ブラウザのタブに表示されるタイトル。また検索結果のタイトルとして使われる場合もある
  description: "我が家の料理を記録・管理するアプリ",    // ページの説明文。検索エンジンの検索結果（description）などに利用される
};

//
// RootLayout
// Next.js App Routerのルートレイアウト。
// app配下のすべてのページで共通して利用される。
// 
// この関数はNext.jsが自動的に呼び出すため、export defaultが必要。
// 
export default function RootLayout(
  {
    children,                   // このレイアウト配下のページ内容が入る
  }: Readonly<{                 // 読み取り専用
    children: ReactNode;        // React要素（ページコンポーネントなど）
  }>
) {
  return (
    <html lang="ja">
      <body
        className={`
          ${geistSans.variable}   // GeistフォントをCSS変数として登録。
          ${geistMono.variable}   // Geist MonoフォントをCSS変数として登録。
          antialiased             // Tailwind CSSの設定。文字のアンチエイリアスを有効にして文字を滑らかに表示する。
        `}
      >
      {/* ${geistSans.variable}：GeistフォントをCSS変数として登録。 */}
      {/* ${geistMono.variable}：Geist MonoフォントをCSS変数として登録。 */}
      {/* antialiased：Tailwind CSSの設定。文字のアンチエイリアスを有効にして文字を滑らかに表示する。 */}
        {/* アプリ全体で利用するContext Provider。この配下のすべてのコンポーネントでContextの値を利用できる。 */}
        <AppProvider>
          {/* h-[100svh]：ビューポートの高さ100%。svhはスマホブラウザのアドレスバー表示などを考慮した高さ単位。 */}
          {/* flex：Flexboxを使用。 */}
          {/* flex-col：子要素を縦方向に並べる。 */}
          <div
            className="
              h-[100svh]
              flex
              flex-col
            "
          >
            {/* 共通トップバー表示。サイドメニュー、タイトル、プルダウンメニューを表示する。中身は各ページで指定する。 */}
            <TopBar />
            {/* 共通サブバー表示。画面によって内容・表示／非表示を変更する場合は、Contextなどからデータを取得して表示する。 */}
            <SubBar />
            {/* コンテンツ領域。各種バーを除いた領域の高さを指定してコンテンツを表示する。 */}
            <ContentArea>
              {/* 実際のページ内容。 */}
              {children}
            </ContentArea>
            {/* 共通ボトムバー表示。画面によって内容・表示／非表示を変更する場合は、Contextなどからデータを取得して表示する。 */}
            <BottomBar />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}