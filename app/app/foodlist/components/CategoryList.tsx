"use client"

/*
    カテゴリーリストの一覧表示
    ＜概要＞
        カテゴリーリストの一覧画面を表示する。
        一番上に新規カテゴリー追加のフォームを表示する。
        カテゴリー名をドラッグすることで並び替えが可能。
        削除ボタンでカテゴリー削除が可能。
        カテゴリーを削除したら、そのカテゴリーのアイテムはカテゴリーなしになる。（未実装）
    ＜使い方＞
        <CategoryList
          categories={categories}
        />

        categories：カテゴリーの配列
*/

import { useState, useEffect, useRef, useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon"
import { FoodCategoryDoc } from "@/foodlist/lib/firestoreDoc"
import { AddFoodCategory, DeleteFoodCategory, saveOrder, UpdateFoodCategory } from "@/foodlist/lib/foodCategory";
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSetMenuItems } from "@/components/MenuItems";
import { ClearCategoryFromItems } from "@/foodlist/lib/items2";
import { getFoodCategories } from "@/foodlist/lib/foodCategory";

type props = {
  categories: FoodCategoryDoc[];
}

export default function CategoryList({ categories: initialCategories }: props) {
  const router = useRouter();

  const [categories, setCategories] = useState<FoodCategoryDoc[]>([]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const { setCategoryList } = useCategoryList();
  useEffect(() => {
    setCategoryList(categories);
  }, [categories, setCategoryList]);

  // @dnd-kit用 使用イベントの設定
  const sensors = useSensors(
    useSensor(PointerSensor, {                  // マウス・タッチのイベント
      activationConstraint: { distance: 5 },    // 誤検知防止
    }),
    useSensor(TouchSensor, {                    // タッチイベント
      activationConstraint: {                   // 長押しでドラッグ起動
        delay: 150,
        tolerance: 5,
      },
    })
  );

  useSetMenuItems(
    [
      {
        name: "戻る",
        onClick: () => { router.back() },
      },
    ]
  );

  // ドラッグ終了時に呼ばれるハンドラ
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;     // active：ドラッグしている要素　over：ドラッグ先の要素

    if (!over || active.id === over.id) return;     // ドラッグ先がない(範囲外など)、あるいは元の位置なら終了（何もしない）

    const oldIndex = categories.findIndex((c) => c.id === active.id);   // 元の位置
    const newIndex = categories.findIndex((c) => c.id === over.id);     // 新しい位置

    const moved = arrayMove(categories, oldIndex, newIndex);            // 元の位置の要素を新しい位置に移動

    // orderの振りなおし
    const updated = moved.map((item, index) => ({
      ...item,
      order: index,
    }));

    setCategories(updated);
    //setCategoryList(updated);
    saveOrder(updated);
  }

  // 新規カテゴリーの追加
  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string)?.trim();

    if (!name) { return; }

    // 新しいカテゴリーを部分的に新規作成（idは後から作成）
    const newCategory: Omit<FoodCategoryDoc, "id"> = {
      name,
      order: 0,       // 新規カテゴリーは先頭に配置
    };

    // 新しいカテゴリーをDBに保存
    const docRef = await AddFoodCategory(categories, newCategory as Omit<FoodCategoryDoc, "id">);

    // カテゴリーリストの更新
    setCategories((prev) => {
      // 先頭に新カテゴリーを追加
      const updated = [
        {
          id: docRef.id,
          ...newCategory,
        },
        ...prev,
      ];

      // orderの振りなおし。順番に並んでいるので、0から順番に振っていく。
      return updated.map((item, index) => ({
        ...item,
        order: index,
      }));
    });

    //setCategoryList(categories);

    // 入力クリア
    form.reset();
  }

  async function handleDelete(id: string) {
    await ClearCategoryFromItems(id);       // このカテゴリーを使っているアイテムのcategoryIdをnullにする

    await DeleteFoodCategory(id);           // 選択されたカテゴリーをDBから削除

    setCategories((prev) => {
      const updated = prev
        .filter((item) => item.id !== id)   // 削除されたカテゴリー以外を残す
        .map((item, index) => ({            // orderの振りなおし
          ...item,
          order: index,
        }));
      saveOrder(updated);                   // カテゴリーリストが更新されたのでDBに保存
      return updated;
    });

    //setCategoryList(categories);
  }

  function handleChange(id: string, name: string) {
    setCategories(prev =>
      prev.map(category =>
        category.id === id
          ? { ...category, name }
          : category
      )
    );

    //setCategoryList(categories);
  }

  async function handleSave(category: FoodCategoryDoc) {
    await UpdateFoodCategory(category.id, category.name);
  }

  return (
    <>
      <div
        className="
          flex flex-col     //flexboxレイアウトにして縦に並べる
          px-4              // 横方向パディング4px
          pt-2              // 上方パディング2px
        "
      >

        {/* 画面最上部に新規カテゴリー追加フォームを表示 */}
        <form
          onSubmit={handleAdd}
          className="
            flex            // 中身をflexboxレイアウトにする
          "
        >
          {/* 新規カテゴリー名 */}
          <input
            name="name"
            className="
              w-full        // 横幅は追加ボタン以外いっぱい
              border        // 枠表示
              rounded       // 角を丸くする
              px-2          // 横方向のパディングを2に
              py-1          // 縦方向のパディングを1に
              text-base     // フォントサイズをbase(16px)に
            "
            placeholder="新規カテゴリー"
          />

          {/* 追加ボタン */}
          <button
            type="submit"
            className="
                        w-[50px]                      // 横幅は50px
                        border                        // 枠表示
                        rounded                       // 角を丸くする
                        bg-[var(--hilight-color)]     // 背景色指定
                        pt-2                          // 上方パディング2px
                      "
          >
            <Icon name="add" />
          </button>
        </form>
      </div>

      {/* カテゴリーリスト表示（ドラッグ＆ドロップ可能） */}

      {/* ドラッグ＆ドロップ全体を管理するルートコンポーネント */}
      <DndContext
        sensors={sensors}                           // 使用イベントの指定
        collisionDetection={closestCenter}          // ドラッグ中の選択要素の判定アルゴリズム（要素の中心点との距離が最小）
        onDragEnd={handleDragEnd}                   // ドラッグ終了時に呼ばれる処理
      >
        {/* 並び替え可能なリスト */}
        <SortableContext
          items={categories.map((c) => c.id)}       // 並べる要素群：カテゴリーリスト
          strategy={verticalListSortingStrategy}    // 並び替え方法：縦方向に並べる
        >
          <div
            className="
              px-4        // 横方向パディング4px
            "
          >
            {categories.map((category) => (         // カテゴリーごとに表示
              <SortableItem
                key={category.id}
                category={category}
                onChange={handleChange}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}

function SortableItem({
  category,
  onChange,
  onSave,
  onDelete,
}: {
  category: FoodCategoryDoc;
  onChange: (id: string, name: string) => void;
  onSave: (category: FoodCategoryDoc) => void;
  onDelete: (id: string) => void;
}) {
  const originalName = useRef(category.name);

  // dnd-kitにこの要素を並び替え対象として登録
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: category.id });

  // ドラッグ中の移動量とアニメーションを適用
  const style = {
    touchAction: "none",                              // スマホでスクロールではなくドラッグ操作を優先
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}          // dnd-kit管理対象のDOMとして登録
      style={style}
      {...attributes}           // ドラッグ用のアクセシビリティ属性
      {...listeners}            // ドラッグ開始イベント
      className="
        flex                    // 中身をflexboxレイアウトにする
        justify-between         // 中身を両端とその間に均等に配置
        border                  // 枠表示
        rounded                 // 角を丸くする
        mt-2                    // 上部余白指定
        bg-white                // 背景色指定
        py-2                    // 上部パディング指定
        px-2                    // 横方向パディング指定
        items-center
      "
    >
      {/* カテゴリー名（この行全体がドラッグ可能） */}
      <input
        value={category.name}
        onChange={(e) =>
          onChange(category.id, e.target.value)
        }
        onBlur={() => {
          if (category.name !== originalName.current) {
            onSave(category);
            originalName.current = category.name;
          }
        }}
        className="flex-1"
      />

      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(category.id)}
        onPointerDown={(e) => e.stopPropagation()}    // 削除ボタン押下時にドラッグ開始しないようイベント伝播を停止
        onTouchStart={(e) => e.stopPropagation()}     // 削除ボタン押下時にドラッグ開始しないようイベント伝播を停止
        className="
          ml-2              // 左部余白指定
          text-red-500      // テキスト色指定
        "
      >
        <Icon name="delete" />
      </button>
    </div>
  );
}

// コンテキストタイプ：カテゴリーリストとセットカテゴリーリストを共有
type CategoryListContextType = {
  CategoryList: FoodCategoryDoc[];
  setCategoryList: (categoryList: FoodCategoryDoc[]) => void;
}


// コンテキスト設定
const CategoryListContext = createContext<CategoryListContextType | undefined>(undefined);

// プロバイダ設定　プロバイダで囲んでコンテキストを共有
export function CategoryListProvider({ children }: { children: React.ReactNode; }) {
  const [CategoryList, setCategoryList] = useState<FoodCategoryDoc[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const categories = await getFoodCategories();
      setCategoryList(categories);
    };

    loadCategories();
  }, []);

  return (
    <CategoryListContext.Provider value={{ CategoryList, setCategoryList }}>
      {children}
    </CategoryListContext.Provider>
  );
}

// コンテキスト取得関数
function useCategoryList() {
  const context = useContext(CategoryListContext);
  if (!context) throw new Error("useTitle must be used within TitleProvider");
  return context;
}

// カテゴリーリスト取得
export function useGetCategoryList() {
  const { CategoryList } = useCategoryList();

  return (CategoryList);
}

// カテゴリーリスト設定（クライアントコンポーネントからの呼び出し）
export function useSetCategoryList(CategoryList: FoodCategoryDoc[]) {
  const { setCategoryList } = useCategoryList();

  // useEffectを使ってタイトル変更時にレンダー実行
  useEffect(() => {
    setCategoryList(CategoryList)
  }, [CategoryList, setCategoryList])
}

// カテゴリーリスト設定（サーバコンポーネントからの呼び出し）
export function SetCategoryList({ CategoryList }: Readonly<{ CategoryList: FoodCategoryDoc[]; }>) {
  useSetCategoryList(CategoryList);

  return null;
}