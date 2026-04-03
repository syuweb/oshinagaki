"use client"
// FoodListメイン画面全体に関わる表示担当

import React from "react";
import { useSetTitle } from "@/components/Title"

export default function TopContainer({ children }: { children: React.ReactNode }) {
    useSetTitle("食べたものリスト");    //ページタイトル

    return (
        <div>
            {children}
        </div>
    );
}