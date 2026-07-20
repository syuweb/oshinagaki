/*
    フードカテゴリーのDB操作
    ＜概要＞
        フードカテゴリーのDB操作（取得、追加、削除など）
    ＜使い方＞
        取得：
            const categories = await getFoodCategories();
                戻り値：FoodCategoryDoc[]　カテゴリーリスト
        追加：
            const docRef = await AddFoodCategory(categories, newCategory );
                戻り値：FoodCategoryDoc　追加したカテゴリー（ID付き）
                categories: FoodCategoryDoc[]
                newCategory: Omit<FoodCategoryDoc, "id">　IDなしの追加するカテゴリー
        削除：
            await DeleteFoodCategory(id);
                id：削除するカテゴリーのID
        更新（order変更）：
            saveOrder(updated);
                updated: FoodCategoryDoc[]
    ＜注意＞
        フードカテゴリーはorderで順序を管理している。
        追加時は自動で順序を更新するが、削除時は自動で順序を更新しないため、削除後に明示的に更新する必要がある(saveOrderを使う)。
*/

import { FoodCategoryDoc } from "@/foodlist/lib/firestoreDoc"
import { db } from "@/lib/firebase"
import { collection, getDocs, DocumentData, writeBatch, doc, query, orderBy, deleteDoc, updateDoc } from "firebase/firestore"

// フードカテゴリをFireStoreから取得
export async function getFoodCategories(): Promise<FoodCategoryDoc[]> {
    // 検索条件
    const q = query(
        collection(db, "foodCategories"),
        orderBy("order", "asc")             // orderの昇順でソート
    );

    // データ取得
    const snapshot = await getDocs(q);

    // FirestoreのドキュメントをFoodCategoryDocへ変換
    return snapshot.docs.map((doc) => {
        return setFoodCategoryDoc(doc.id, doc.data());
    });
}

// 新規フードカテゴリをFireStoreに格納
export async function AddFoodCategory(categories: FoodCategoryDoc[], newCategory: Omit<FoodCategoryDoc, "id">) {
    const batch = writeBatch(db);

    // 既存のカテゴリのorderをずらす
    categories.forEach((c) => {
        const ref = doc(db, "foodCategories", c.id);
        batch.update(ref, { order: c.order + 1 });
    });

    // 新規追加
    const newRef = doc(collection(db, "foodCategories"));
    batch.set(newRef, newCategory);

    // FireStore更新
    await batch.commit();

    // 格納したフードカテゴリ(ID付き)を返す
    return (newRef);
}

// フードカテゴリをFireStoreから削除
export async function DeleteFoodCategory(id: string) {
    await deleteDoc(doc(db, "foodCategories", id));
    return id;
}

// フードカテゴリを更新する（order更新をFireStoreに反映）
export async function saveOrder(categories: FoodCategoryDoc[]) {
    const batch = writeBatch(db);

    categories.forEach((c) => {
        const ref = doc(db, "foodCategories", c.id);
        batch.update(ref, { order: c.order });
    });

    await batch.commit();
}

// データベースのデータをアプリで使う形式に変換
//      ※ 変換しなくても使用可能だが、型のあいまいさを排することで品質確保を図る
function setFoodCategoryDoc(id: string, data: DocumentData) {
    return {
        id: id,
        name: data.name ?? "",
        order: data.order ?? -1,
    };
}

export async function UpdateFoodCategory(
    id: string,
    name: string
) {
    await updateDoc(
        doc(db, "foodCategories", id),
        {
            name,
        }
    );
}