// DataEditの共通レイアウト（トップバー表示）

import React from "react";
import { TitleProvider } from "@/components/Title";
import { TopBar } from "./components/TopBar";

export default function FoodListLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <TitleProvider> {/* FoodListコンポーネント全体にタイトル名の取得・変更を許可 */}
            <div
                className="
                    h-screen    //高さがスクリーン全体
                "
            >
                <TopBar />  {/* トップバー表示 */}
                <main
                    className="
                        pt-[var(--topbar-height)]   //トップバーと重ならないように画面上部をパディング
                        h-full                      //高さは親コンポーネントの高さと同等
                        overflow-auto               //スクロールバーは必要なときのみ表示
                    "
                >
                    {children}
                </main>
            </div>
        </TitleProvider>
    );
}
