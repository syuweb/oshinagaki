/*
    foodlist/layout.tsx
    ＜概要＞
        FoodListの共通レイアウト指定。
        FoodListのプルダウンメニューを設定。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import React from "react";
import { AppProvider } from "@/foodlist/components/AppProvider"

export default function FoodListLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    );
}
