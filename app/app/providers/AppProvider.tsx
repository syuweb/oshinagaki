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

import type { ReactNode } from "react";

import { ActionProvider } from "@/providers/ActionProvider";
import { BottomBarProvider } from "@/components/BottomBar";
import { MenuItemsProvider } from "@/providers/MenuItemsProvider";
import { SubBarProvider } from "@/providers/SubBarProvider";
import { TitleProvider } from "@/providers/TitleProvider";

export function AppProvider({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <MenuItemsProvider>                     {/* プルダウンメニューのメニューリストを管理するContext */}
            <ActionProvider>                    {/* サブミットのアクションを管理するContext */}
                <TitleProvider>                 {/* ページタイトルを管理するContext */}
                    <SubBarProvider>            {/* サブバーの表示内容・高さを管理するContext */}
                        <BottomBarProvider>     {/* ボトムバーの表示内容・高さを管理するContext */}
                            {children}
                        </BottomBarProvider>
                    </SubBarProvider>
                </TitleProvider>
            </ActionProvider>
        </MenuItemsProvider>
    );
}
