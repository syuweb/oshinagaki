"use client"

/*
    新規フードアイテムの追加
    ＜概要＞
        新規に追加するフードアイテムの情報を入力するフォームを表示する。
    ＜使い方＞
        <AddNewItem
            categories={categories}
        />

        categories：カテゴリーの配列
*/

import * as exifr from "exifr";
import { useState, useEffect, useRef, createContext, useContext, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation";
import { useSetTitle } from "@/hooks/useTitle";
import { Icon } from "@/components/Icon";
import { ImageSlider, PreviewImage } from "@/components/ImageSlider";
import { ItemDoc2, ItemImage, Rating, RatingName, RATING_NAMES } from "@/foodlist/lib/firestoreDoc";
import { uploadToCloudinary } from "@/foodlist/lib/cloudinary";
import { addItem2 } from "@/foodlist/lib/items2";
import { useSetBottomBar } from "@/components/BottomBar";
import { useSetMenuItems } from "@/hooks/useMenuItems"
import { useSetAction, useGetAction } from "@/hooks/useAction";
import { useGetCategoryList } from "@/foodlist/components/CategoryList";

export function AddNewItem() {
    useSetTitle("新しいアイテムを登録");    //ページタイトル
    const [error, setError] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState(0);                // 表示中の画像インデックス
    //const [images, setImages] = useState<PreviewImage[]>([]);
    //const [lastEaten, setLastEaten] = useState(                         // 最後に食べた日
    //    new Date().toISOString().split("T")[0]
    //);
    const lastEaten = useGetLastEaten();
    const setLastEaten = useSetLastEaten();

    const images = useGetImages();
    const setImages = useSetImages();

    const ratings = useGetRatings();
    const setRatings = useSetRatings();

    const clearItemProperty = useGetClearItemProperty();
    const setInitialized = useSetInitialized();

    useEffect(() => {
        clearItemProperty();
        setInitialized(true);
    }, [clearItemProperty, setInitialized]);

    const router = useRouter();

    //    const imagesRef = useRef(images);
    const formRef = useRef<HTMLFormElement>(null);

    useSetAction(formRef);
    /*
        useEffect(() => {
            imagesRef.current = images;
        }, [images]);
    
        useEffect(() => {
            return () => {
                imagesRef.current.forEach((image) => {
                    if (image.url.startsWith("blob:")) {
                        URL.revokeObjectURL(image.url);
                    }
                });
            };
        }, []);
    */
    const executeAction = useGetAction();

    const categories = useGetCategoryList();

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const menuItems = useMemo(
        () => [
            {
                name: "登録",
                onClick: executeAction,
            },
            {
                name: "戻る",
                onClick: handleBack,
            },
        ],
        [executeAction, handleBack]
    );

    useSetMenuItems(menuItems);

    /* ボトムバー設定 */
    useSetBottomBar(
        <div
            className="
                        px-8        // 横方向パディング8px
                        flex        // 中身をflexboxレイアウトにする
                        gap-4       // 要素間のギャップ
                    "
        >
            <button
                onClick={executeAction}
                className="
                            flex-1          // 自身のwidth、またはheightのサイズを無視して伸び縮みする
                            border          // 枠表示
                            rounded         // 角を丸くする
                            py-1            // 縦方向パディング1px
                            text-base       // フォントサイズをbase(16px)に
                        "
            >
                登録
            </button>

            <button
                type="button"
                onClick={() => router.back()}
                className="
                            flex-1          // 自身のwidth、またはheightのサイズを無視して伸び縮みする
                            border          // 枠表示
                            rounded         // 角を丸くする
                            py-1            // 縦方向パディング1px
                            text-base       // フォントサイズをbase(16px)に
                        "
            >
                戻る
            </button>
        </div>,
        [executeAction]
    )

    /* 追加処理 */
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = (formData.get("name") as string)?.trim();

        /* 名前 */
        if (!name) {
            setError("名前は必須です");
            return;
        }
        const item: Partial<ItemDoc2> = { name };        // 新しいアイテムをnameだけで作成

        /* 画像 */
        const itemImages: ItemImage[] = await Promise.all(
            images.map(async (image) => {
                // 新規追加画像ならCloudinaryへアップロード
                if (image.file) {
                    const { url, publicId } = await uploadToCloudinary(image.file);

                    return {
                        url,
                        publicId,
                        createdAt: image.createdAt,
                    };
                }

                // 元からある画像
                return {
                    url: image.url,
                    publicId: image.publicId!,
                    createdAt: image.createdAt,
                };
            })
        );
        item.images = itemImages;                                               // 新しいアイテムに紐づけ

        /* カテゴリー */
        const category = formData.get("category") as string;
        if (category && category.trim() !== "") {
            item.categoryId = category;
        }

        /* 最後に食べた日 */
        if (lastEaten) {
            item.lastEaten = lastEaten;
        }

        /* 説明 */
        const description = formData.get("description") as string;
        if (description && description.trim() !== "") {
            item.description = description;
        }

        /* 評価 */
        if (ratings) {
            item.ratings = ratings;
        }

        await addItem2(item as Omit<ItemDoc2, "id">);

        /* トップ画面に移動 */
        router.push("/");
    }

    function deleteImage(index: number) {
        setImages((prev) => {
            const image = prev[index];

            URL.revokeObjectURL(image.url);

            return prev.filter((_, i) => i !== index);
        });

        setCurrentImage((prev) => {
            if (prev > index) {
                // 削除位置より後ろなら1つ前へ
                return prev - 1;
            }

            if (prev === index) {
                // 削除した画像を表示していた
                return Math.max(0, prev - 1);
            }

            // 削除位置より前ならそのまま
            return prev;
        });
    }

    const setName = useSetName();
    const setCategoryId = useSetCategoryId();
    const setDescription = useSetDescription();

    const handleRatingChange = async (
        name: RatingName,
        score: number
    ) => {
        const nextRatings = ratings.map((r) =>
            r.name === name ? { ...r, score } : r
        );

        // ① 画面更新（即反映）
        setRatings(nextRatings);
    };

    return (
        <div
            className="
                px-4        // 横方向パディング4px
                py-1        // 縦方向のパディングを1に
            "
        >
            <form
                ref={formRef}
                onSubmit={handleSubmit}     // 追加ボタンを押したときの処理
            >
                {/* エラー：入力内容に問題がある場合などに画面上部に赤文字でエラー内容を表示する */}
                {error && (
                    <p
                        className="
                            text-sm         // フォントサイズ指定(14px)
                            text-red-600    // フォントカラー指定
                        "
                    >
                        {error}
                    </p>
                )}

                {/* メニュー名 */}
                <div
                    className="
                        py-1        // 縦方向のパディングを1に
                    "
                >
                    <label
                        className="
                            text-xl         // フォントサイズ20px
                            font-medium     // フォントの太さ(Weight)を指定(500)
                        "
                    >
                        アイテム名 <span className="text-red-500">*</span>
                    </label>
                    <div
                        className="
                            px-4        // 横方向パディング4px
                        "
                    >
                        <input
                            name="name"
                            className="
                                w-full          // 幅はメニュー幅に合わせる
                                border          // 枠表示
                                rounded         // 角を丸くする
                                px-2            // 横方向パディング2px
                                py-1            // 縦方向パディング1px
                                text-base       // フォントサイズをbase(16px)に
                            "
                            placeholder="例：ラーメン"
                            value={useGetName()}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* メニュー画像 */}
                <div className="py-1">
                    <label
                        className="
                            text-xl             // フォントサイズ20px
                            font-medium         // フォントの太さ(Weight)を指定(500)
                        "
                    >
                        アイテム画像
                    </label>
                    <div
                        className="
                            px-4            // 横方向パディング4px
                            flex            // 中身をflexboxレイアウトにする
                            items-end       // 垂直方向の終端側に寄せる
                        "
                    >
                        <div
                            className="
                                h-[var(--image-size)]           // 画像表示の高さ指定
                                w-[var(--image-size)]           // 画像表示の幅指定
                                flex                            // 中身をflexboxレイアウトにする
                                items-center                    // 縦方向中央揃え
                                justify-center                  // 横方向中央揃え
                                border                          // 枠表示
                                rounded                         // 角を丸くする
                                leading-none                    // 改行幅を小さく
                            "
                        >
                            {(!images || images.length === 0) ? (
                                <div>No < br /> Image</div>
                            ) : (
                                <ImageSlider
                                    images={images}
                                    setImages={setImages}
                                    indicator={15}
                                    currentIndex={currentImage}
                                    onCurrentIndexChange={setCurrentImage}
                                    className="
                                    h-[var(--image-size)]     // 画像表示の高さ指定
                                    w-[var(--image-size)]     // 画像表示の幅指定
                                "
                                />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <button
                                type="button"
                                onClick={() => deleteImage(currentImage)}
                            >
                                <Icon name="delete" size={64} />
                            </button>
                            <input
                                type="file"
                                multiple                        // 複数画像指定を許可
                                id="file"
                                name="images"
                                accept="image/*"                // 画像ファイルが対象
                                className="
                                hidden                      // 要素を非表示にする
                            "
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (!files || files.length === 0) return;

                                    const fileArray = Array.from(files);

                                    const newImages: PreviewImage[] = await Promise.all(
                                        fileArray.map(async (file) => {
                                            const url = URL.createObjectURL(file);

                                            const exif = await exifr.parse(file);
                                            const createdAt = exif?.DateTimeOriginal
                                                ? new Date(exif.DateTimeOriginal)
                                                    .toISOString()
                                                    .slice(0, 10)
                                                : "";

                                            return {
                                                url,
                                                createdAt,
                                                file,
                                            };
                                        })
                                    );

                                    setImages((prev) => [
                                        ...prev,
                                        ...newImages,
                                    ]);

                                    e.target.value = "";
                                }}
                            />
                            <label
                                htmlFor="file"
                            >
                                <Icon name="add_photo_alternate" size={64} />       {/* 画像追加アイコン */}
                            </label>
                        </div>
                    </div>
                </div>

                {/* カテゴリー */}
                <div className="py-1">
                    <label
                        className="
                            text-xl         // フォントサイズ20px
                            font-medium     // フォントの太さ(Weight)を指定(500)
                        "
                    >
                        カテゴリー
                    </label>
                    <div
                        className="
                            px-4            // 横方向パディング4px
                        "
                    >
                        <select
                            className="
                                w-full          // 幅はメニュー幅に合わせる
                                border          // 枠表示
                                rounded         // 角を丸くする
                                px-2            // 横方向パディング2px
                                py-1            // 縦方向パディング1px
                                text-base       // フォントサイズをbase(16px)に
                            "
                            name="category"
                            value={useGetCategoryId()}
                            onChange={(e) => {
                                const url = e.target.value;
                                if (url === "__new__") {
                                    router.push('/foodlist/category');
                                } else {
                                    setCategoryId(e.target.value);
                                }
                            }}
                        >
                            <option value="">選択してください</option>

                            {
                                categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))
                            }

                            <option value="__new__">＋ 新規カテゴリを作る</option>
                        </select>
                    </div>
                </div>

                {/* 最後に食べた日 */}
                <div
                    className="
                        py-1        // 縦方向パディング1px
                    "
                >
                    <label
                        className="
                            text-xl         // フォントサイズ20px
                            font-medium     // フォントの太さ(Weight)を指定(500)
                        "
                    >
                        最後に食べた日
                    </label>
                    <div
                        className="
                            px-4            // 横方向パディング4px
                            pr-[34px]       // 右方向パディング34px
                        "
                    >
                        <input
                            type="date"
                            value={lastEaten}
                            onChange={(e) => setLastEaten(e.target.value)}
                            className="
                                w-full          // 幅はメニュー幅に合わせる
                                border          // 枠表示
                                rounded         // 角を丸くする
                                px-2            // 横方向パディング2px
                                py-1            // 縦方向パディング1px
                                text-base       // フォントサイズをbase(16px)に
                            "
                        />
                    </div>
                </div>

                {/* 説明 */}
                <div
                    className="
                        py-1        // 縦方向パディング1px
                    "
                >
                    <label
                        className="
                            text-xl         // フォントサイズ20px
                            font-medium     // 右方向パディング34px
                        "
                    >
                        説明
                    </label>
                    <div
                        className="
                            px-4            // 横方向パディング4px
                        "
                    >
                        <textarea
                            name="description"
                            rows={3}                // ３行分の入力エリア
                            className="
                                w-full              // 幅はメニュー幅に合わせる
                                border              // 枠表示
                                rounded             // 角を丸くする
                                px-2                // 横方向パディング2px
                                py-1                // 縦方向パディング1px
                                text-base           // フォントサイズをbase(16px)に
                            "
                            placeholder="メモなど"
                            value={useGetDescription()}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* 評価 */}
                <div
                    className="
                        py-1        // 縦方向パディング1px
                    "
                >
                    <label
                        className="
                            text-xl         // フォントサイズ20px
                            font-medium     // 右方向パディング34px
                        "
                    >
                        評価
                    </label>
                    <div className="flex-column items-center gap-3 px-4">
                        {ratings.map((r) => (
                            <div key={r.name} className="flex items-center gap-3">
                                <span className="font-medium">{r.name}</span>

                                <StarRating
                                    score={r.score}
                                    onChange={(v) => handleRatingChange(r.name, v)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </form >
        </div >
    );
}

type StarRatingProps = {
    score: number;
    onChange: (value: number) => void;
};

export function StarRating({ score, onChange }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
                <button
                    type="button"
                    key={v}
                    onClick={() => onChange(v)}
                    className="min-h-[44px]"
                >
                    {v <= score ? "★" : "☆"}
                </button>
            ))}
        </div>
    );
}

// コンテキストタイプ
type ItemPropertyContextType = {
    initialized: boolean;
    setInitialized: (flag: boolean) => void;

    name: string;
    setName: (name: string) => void;

    categoryId: string;        // カテゴリー
    setCategoryId: (categoryId: string) => void;

    description: string;       // 説明
    setDescription: (description: string) => void;

    images: PreviewImage[];       // 画像（複数）
    setImages: React.Dispatch<React.SetStateAction<PreviewImage[]>>;

    lastEaten: string;      // 最後に食べた日
    setLastEaten: (lastEaten: string) => void;

    ratings: Rating[];      // 評価
    setRatings: (ratings: Rating[]) => void;

    refresh: (item: ItemDoc2, images: PreviewImage[]) => void;
    clearItemProperty: () => void;
}

// コンテキスト設定
const ItemPropertyContext = createContext<ItemPropertyContextType | undefined>(undefined);

// プロバイダ設定 プロバイダで囲んでコンテキストを共有
export function ItemPropertyProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [initialized, setInitialized] = useState(false);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<PreviewImage[]>([]);
    const [lastEaten, setLastEaten] = useState(new Date().toISOString().split("T")[0]);
    const [ratings, setRatings] = useState<Rating[]>([]);

    const refresh = (item: ItemDoc2, images: PreviewImage[]) => {
        if (initialized) return;

        setName(item.name);
        setCategoryId(item.categoryId ?? "");
        setLastEaten(item.lastEaten ?? "");
        setDescription(item.description ?? "");
        setImages(images ?? []);
        setRatings(item.ratings ?? []);
    }
    const clearItemProperty = () => {
        if (initialized) return;

        setName("");
        setCategoryId("");
        setLastEaten(new Date().toISOString().split("T")[0]);
        setDescription("");
        setImages([]);

        const defaultRatings = (() =>
            RATING_NAMES.map((name) => {
                return {
                    name,
                    score: 0,
                };
            })
        );
        setRatings(defaultRatings);
    }

    return (
        <ItemPropertyContext.Provider value={{ initialized, setInitialized, name, setName, categoryId, setCategoryId, description, setDescription, images, setImages, lastEaten, setLastEaten, ratings, setRatings, refresh, clearItemProperty }}>
            {children}
        </ItemPropertyContext.Provider>
    );
}

// コンテキスト取得関数
function useItemProperty() {
    const context = useContext(ItemPropertyContext);
    if (!context) throw new Error("useItemProperty must be used within ItemPropertyProvider");
    return context;
}

export function useSetInitialized() {
    const { setInitialized } = useItemProperty();

    return (setInitialized);
}

// 名前取得
export function useGetName() {
    const { name } = useItemProperty();

    return (name);
}

// 名前セット関数取得
export function useSetName() {
    const { setName } = useItemProperty();

    return (setName);
}

// カテゴリーID取得
export function useGetCategoryId() {
    const { categoryId } = useItemProperty();

    return (categoryId);
}

// カテゴリーIDセット関数取得
export function useSetCategoryId() {
    const { setCategoryId } = useItemProperty();

    return (setCategoryId);
}

// 説明文取得
export function useGetDescription() {
    const { description } = useItemProperty();

    return (description);
}

// 説明文セット関数取得
export function useSetDescription() {
    const { setDescription } = useItemProperty();

    return (setDescription);
}

// 画像取得
export function useGetImages() {
    const { images } = useItemProperty();

    return (images);
}

// 画像セット関数取得
export function useSetImages() {
    const { setImages } = useItemProperty();

    return (setImages);
}

// 最後に食べた日取得
export function useGetLastEaten() {
    const { lastEaten } = useItemProperty();

    return (lastEaten);
}

// 最後に食べた日セット関数取得
export function useSetLastEaten() {
    const { setLastEaten } = useItemProperty();

    return (setLastEaten);
}

export function useGetRatings() {
    const { ratings } = useItemProperty();

    return (ratings);
}

export function useSetRatings() {
    const { setRatings } = useItemProperty();

    return (setRatings);
}

export function useGetRefresh() {
    const { refresh } = useItemProperty();

    return (refresh);
}

export function ResetInitialized() {
    const { setInitialized } = useItemProperty();

    setInitialized(false);

    return null;
}

export function useGetClearItemProperty() {
    const { clearItemProperty } = useItemProperty();

    return (clearItemProperty);
}