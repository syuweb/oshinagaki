"use client"

import { loadItems } from "@/dataedit/lib/items";
import { saveItems2 } from "@/dataedit/lib/items2";
import { translateItemsToItems2 } from "@/dataedit/lib/itemsToItems2";

export function DataView() {

    const translate1 = async () => {
        alert("start translate");
        const originalData = await loadItems();
        alert(originalData.length);
        const translatedData = await translateItemsToItems2(originalData);
        alert(translatedData.length);
        saveItems2(translatedData);
        alert("end translate");
    }

    return (
        <>
            <div className="text-xl">変換１</div>
            <div className="px-4 flex items-center text-base">
                <button
                    onClick={() => translate1()}
                    className="px-4 border rounded"
                >
                    変換
                </button>
                <div className="px-4 text-base">変更元：items　変更先：items2</div>
            </div>
        </>
    );
}