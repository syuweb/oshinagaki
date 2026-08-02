"use client"
// DataEditの共通レイアウト（トップバー表示）

import React from "react";
import { useSetTitle } from "@/hooks/useTitle"

export default function FoodListLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useSetTitle("Firestore データ編集");    //ページタイトル

    return (
        <div>
            {children}
        </div>
    );
}
