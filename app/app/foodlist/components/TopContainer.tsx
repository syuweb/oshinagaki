"use client"
// FoodListメイン画面全体に関わる表示担当

import React from "react";
import { useSetTitle } from "@/components/Title"
import { useSetMenuItems } from "@/components/MenuItems"

export default function TopContainer({ children }: { children: React.ReactNode }) {
    useSetTitle("食べたものリスト２");    //ページタイトル
    useSetMenuItems([                   // プルダウン用メニューアイテム
        {
            name: "追加２",
            onClick: () => alert("add"),
        },
        {
            name: "編集２",
            onClick: () => alert("edit"),
        },
        {
            name: "その他",
            onClick: () => alert("others"),
        },
    ]);

    return (
        <div>
            {children}
        </div>
    );
}