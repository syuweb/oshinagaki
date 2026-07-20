/*
    Firestore用データ定義
*/


import { Timestamp } from "firebase/firestore";

export const RATING_NAMES = ["かずみ", "しゅう", "ゆうた"] as const;

export type RatingName = (typeof RATING_NAMES)[number];

// 評価
export type Rating = {
    name: RatingName;
    score: number;
};

// 画像
export type ItemImage = {
    url: string;                // Cloudinaryの画像表示用URL
    publicId: string;           // 画像ID（Cloudinary用）
    createdAt: string;          // 画像撮影時刻
};

// 食べたもの
export type ItemDoc2 = {
    id: string;
    name: string;
    categoryId?: string;        // カテゴリー
    description?: string;       // 説明

    images?: ItemImage[];       // 画像（複数）

    lastEaten?: string;      // 最後に食べた日
    ratings?: Rating[];         // 評価（３件）
};

// カテゴリ
export type FoodCategoryDoc = {
    id: string;
    name: string;
    order: number;              // カテゴリの並び順
};

// 時刻文字列からTimestamp型への変換
export function toTimestamp(dateStr: string | null): Timestamp {
    const date = new Date(dateStr + "T00:00:00");
    return Timestamp.fromDate(date);
}

// Timestamp型から日付文字列（YYYY-MM-DD）への変換
export function toDateString(timestamp: Timestamp | null): string {
    if (!timestamp) {
        return "";
    }

    const date = timestamp.toDate();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
