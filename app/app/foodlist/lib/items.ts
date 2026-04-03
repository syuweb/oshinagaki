import { doc, collection, getDoc, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ItemDoc } from "@/lib/item"

type props = {
    id: string;
}

/*
    データ取得／登録
    ＜概要＞
        データベース(Firestore)からのデータ取得、データベースへのデータ登録を行う
    ＜使い方＞
        １データ取得：
            data = getItem(id);
        全データ取得：
            data = getItems();
*/

export async function getItem({ id }: props) {
    const ref = doc(db, "items", id);   // db:Firebaseインスタンス　"items":コレクション名
    const snap = await getDoc(ref);

    if (!snap.exists()) return;     // データがなければエラー

    const data = snap.data() as ItemDoc;

    return (setItemDoc(id, data));  // 取得したデータをアプリで使う形式に変換して返す
}

export async function getItems(): Promise<ItemDoc[]> {
    const snapshot = await getDocs(collection(db, "items"));

    return snapshot.docs.map((doc) => {     // 一つずつのデータをまとめて返す
        return setItemDoc(doc.id, doc.data());  // 一つのデータをアプリで使う形式に変換して返す
    });
}

// データベースのデータをアプリで使う形式に変換
//      ※ 変換しなくても使用可能だが、型のあいまいさを排することで品質確保を図る
function setItemDoc(id: string, data: DocumentData) {
    return {
        id: id,
        name: data.name ?? "",
        category: data.category || undefined,
        description: data.description || undefined,
        image: data.image
            ? {
                url: data.image.url,
                publicId: data.image.publicId,
            }
            : undefined,
        lastEaten: data.lastEaten || undefined,
        ratings: data.ratings || undefined,
    };
}