/*
    page.tsx
    ＜概要＞
        アプリのトップページ。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/foodlist");            // 当面はfoodlistだけを実装するため、foodlistにリダイレクト
}
