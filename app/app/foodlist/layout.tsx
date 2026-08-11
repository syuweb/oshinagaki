/*
    foodlist/layout.tsx
    ＜概要＞
        FoodListの共通レイアウト指定。
    ＜使い方＞
        自動で呼び出されるため使い方は不要。
*/

import type { ReactNode } from "react";

import { AppProvider } from "@/foodlist/providers/AppProvider"

export default function FoodListLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    );
}
