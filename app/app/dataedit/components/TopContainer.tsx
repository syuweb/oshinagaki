"use client"
// DataEditメイン画面全体に関わる表示担当

import React from "react";
import { useSetTitle } from "@/components/Title"

export default function TopContainer({ children }: { children: React.ReactNode }) {
    useSetTitle("Firestore データ編集");    //ページタイトル

    return (
        <div>
            {children}
        </div>
    );
}