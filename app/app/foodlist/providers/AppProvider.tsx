"use client"

/*
    コンテキストの一括設定

    概要：
        アプリ全体で使用するContextをまとめて提供するProvider
    使い方
        <AppProvider>
            {children}
        </AppProvider>
*/

import { ReactNode } from "react";

import { ItemPropertyProvider } from "@/foodlist/components/AddNewItem";
import { CategoryListProvider } from "@/foodlist/components/CategoryList";


export async function AppProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <CategoryListProvider>
            <ItemPropertyProvider>
                {children}
            </ItemPropertyProvider>
        </CategoryListProvider>
    );
}
