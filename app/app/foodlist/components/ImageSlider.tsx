"use client"

/*
    イメージスライダー

    概要：
        複数の画像のうち１枚を表示、左右フリックで画像を切り替える
    使い方
        <ImageSlider
            images = {images}                           // 画像URLの配列（必須）
            setImages = {setImages}                     // 画像の変更（任意）　指定しない場合は変更不可
            indicator= {3}                              // インディケーター(表示している画像の位置がわかる)の最大個数（任意）
                                                            指定しない、あるいは0の場合はインディケーターを表示しない
                                                            画像が1枚の場合はインディケーターは表示されない
            currentIndex = {currentIndex}               // 表示中の画像のインデックス。呼び出し元でuseStateする
            onCurrentIndexChange = {setCurrentIndex}    // 表示画像が変更された場合に呼び出される
            className = {h-[200px] w-[200px]}           // 画像の縦横を指定。指定しない場合は縦横150px
        />
*/

import { useState, useRef } from "react";
import Image from "next/image";

export type PreviewImage = {
    url: string;
    createdAt: string;
    file?: File;          // 新しく追加した画像だけ持つ
    publicId?: string;    // 既存画像だけ持つ（更新時に削除で使う）
};

type props = {
    images: PreviewImage[];
    setImages?: React.Dispatch<React.SetStateAction<PreviewImage[]>>;
    indicator?: number;
    currentIndex?: number;
    onCurrentIndexChange?: (index: number) => void;
    className?: string;
}

export function ImageSlider({ images, setImages, indicator, currentIndex, onCurrentIndexChange, className }: props) {
    const [internalIndex, setInternalIndex] = useState(0);            // 現在表示している画像のIndex

    const startX = useRef(0);                   // スワイプ開始時のx座標
    const endX = useRef(0);                     // スワイプ終了時のx座標

    const max = indicator ?? 0;                 // インディケーターの最大数
    const half = Math.floor(max / 2);           // インディケーターの最大数の半分（中央）

    const current =
        currentIndex !== undefined
            ? currentIndex
            : internalIndex;

    function setCurrent(index: number) {
        if (currentIndex === undefined) {
            // 親が管理していないので自分で更新
            setInternalIndex(index);
        }

        // 親にも通知
        onCurrentIndexChange?.(index);
    }

    function moveCurrent(diff: number) {
        const next = Math.min(
            Math.max(current + diff, 0),
            images.length - 1
        );

        setCurrent(next);
    }

    let start = current - half;            // 表示するインディケーターの左端のIndex（表示画像から左にharf分）
    let end = current + half + 1;          // 表示するインディケーターの右端のIndex（表示画像から右にharf+1分）

    // 左端補正
    if (start < 0) {
        start = 0;
        end = Math.min(images.length, max);
    }

    // 右端補正
    if (end > images.length) {
        end = images.length;
        start = Math.max(0, end - max);
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        endX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = startX.current - endX.current;

        // 閾値（これ以上動いたらスワイプと判定）
        const threshold = 50;

        if (diff > threshold) {
            // 左スワイプ → 次へ
            moveCurrent(1);
        } else if (diff < -threshold) {
            // 右スワイプ → 前へ
            moveCurrent(-1);
        }
    };

    const updateDate = (index: number, newDate: string) => {
        if (!setImages) return;

        setImages((prev) => {
            const copy = [...prev];
            copy[index] = {
                ...copy[index],
                createdAt: newDate,
            };
            return copy;
        });
    };

    if (images.length === 0) return null;

    return (
        <div
            className="
                relative                // 後のabsolute要素のオフセット基準となる
                w-full                  // 幅はメニュー幅に合わせる
                overflow-hidden         // コンテンツが要素からはみ出す場合に切り取る（表示しない）。ユーザーからのスクロール操作は受け付けない
            "
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="
                    flex                        // 中身をflexboxレイアウトにする
                    transition-transform        // 変形パラメータをなめらかに遷移
                    duration-300                // 遷移の時間指定
                    ease-out                    // 徐々に減速させる
                "
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {images.map((image) => (
                    <Image
                        key={image.url}
                        src={image.url}
                        alt="preview"
                        className={`flex-shrink-0 object-contain h-[150px] w-[150px] ${className}`}
                        width={800}
                        height={800}
                    />
                ))}
            </div>
            {/* インジケーター表示（上） */}
            {(!(images.length === 1) && !(max === 0)) &&
                <div
                    className="
                        absolute                // relative要素をオフセット基準とする
                        top-2                   // 縦位置をrelativeの上から2あける
                        left-1/2                // 左右中心に
                        -translate-x-1/2        // 真ん中に補正
                        flex                    // 中身をflexboxレイアウトにする
                        gap-2                   // 要素間のギャップ
                        items-                  // 縦方向中央揃え
                    "
                >
                    {images.slice(start, end).map((_, i) => {      // 左端から右端まで
                        const realIndex = start + i;
                        return (
                            <span
                                key={realIndex}
                                className={`
                                    rounded-full                        // 円
                                    transition-all                      // すべてのプロパティを遷移
                                    duration-300                        // 遷移時間300ms
                                    border                              // 枠表示
                                    border-black                        // 枠色
                                    ${realIndex === current
                                        ? "w-3 h-3 bg-white"            // 中央は白
                                        : "w-2 h-2 bg-white/50"}        // それ以外はグレー
                                `}
                            />
                        );
                    })}
                </div>
            }
            {/* 日付表示（下） */}
            {setImages ? (
                <input
                    type="date"
                    value={images[current]?.createdAt ?? ""}
                    onChange={(e) => updateDate(current, e.target.value)}
                    className="
                        absolute
                        bottom-2
                        left-1/4
                        right-1/4
                        text-center
                        mt-2
                        text-sm
                        text-black
                        bg-white
                        border
                        border-black
                        rounded
                    "
                />
            ) : (
                <div
                    className="
                        absolute
                        bottom-2
                        left-1/4
                        right-1/4
                        text-center
                        mt-2
                        text-sm
                        text-black
                        bg-white
                        border
                        border-black
                        rounded
                    "
                >
                    {images[current]?.createdAt ?? "　"}
                </div>
            )}
        </div>
    );
}
