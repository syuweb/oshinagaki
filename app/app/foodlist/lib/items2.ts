/*
    データ取得／登録
    ＜概要＞
        データベース(Firestore)からのデータ取得、データベースへのデータ登録を行う
    ＜使い方＞
        １データ取得：
            data = getItem2(id);
        全データ取得：
            data = getItems2();
        データ登録：
            addItem2(item);
        データ削除：
            deleteItem2(id);
        データ更新：
            updateItem2(item);
*/

import { doc, collection, getDoc, getDocs, addDoc, deleteDoc, updateDoc, DocumentData, query, where, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ItemDoc2, ItemImage } from "@/foodlist/lib/firestoreDoc";
import { deleteFromCloudinary } from "@/foodlist/lib/cloudinary";

type props = {
    id: string;
}

export async function getItem2({ id }: props) {
    const ref = doc(db, "items2", id);   // db:Firebaseインスタンス　"items":コレクション名
    const snap = await getDoc(ref);

    if (!snap.exists()) return;     // データがなければエラー

    const data = snap.data() as ItemDoc2;

    return (setItemDoc(id, data));  // 取得したデータをアプリで使う形式に変換して返す
}

export async function getItems2(): Promise<ItemDoc2[]> {
    const snapshot = await getDocs(collection(db, "items2"));

    return snapshot.docs.map((doc) => {     // 一つずつのデータをまとめて返す
        return setItemDoc(doc.id, doc.data());  // 一つのデータをアプリで使う形式に変換して返す
    });
}

export async function addItem2(
    item: Omit<ItemDoc2, "id">
) {
    await addDoc(collection(db, "items2"), item);
}

export async function deleteItem2(itemId: string) {
    const ref = doc(db, "items2", itemId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();
    const images = (data.images ?? []) as ItemImage[];
    await Promise.all(
        images
            .filter((image) => image.publicId)
            .map((image) =>
                deleteFromCloudinary(image.publicId)
            )
    );

    await deleteDoc(ref);
}

export async function updateItem2(item: ItemDoc2) {
    const { id, ...data } = item;

    await updateDoc(
        doc(db, "items2", id),
        data
    );
}

export async function ClearCategoryFromItems(categoryId: string) {
    const q = query(
        collection(db, "items2"),
        where("categoryId", "==", categoryId)
    );

    const snapshot = await getDocs(q);

    const batch = writeBatch(db);

    snapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, {
            categoryId: null,
        });
    });

    await batch.commit();
}

// データベースのデータをアプリで使う形式に変換
//      ※ 変換しなくても使用可能だが、型のあいまいさを排することで品質確保を図る
function setItemDoc(id: string, data: DocumentData) {
    return {
        id: id,
        name: data.name ?? "",
        categoryId: data.categoryId || undefined,
        description: data.description || undefined,
        images: Array.isArray(data.images)
            ? data.images.map((image: DocumentData) => ({
                url: image.url ?? "",
                publicId: image.publicId ?? "",
                createdAt: image.createdAt ?? "",
            }))
            : undefined,
        lastEaten: data.lastEaten || undefined,
        ratings: data.ratings || undefined,
    };
}

