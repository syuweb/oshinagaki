import { ItemDoc2 } from "@/foodlist/lib/firestoreDoc"
import { addItem2 } from "@/foodlist/lib/items2";

export function saveItems2(data: ItemDoc2[]) {
    data.map(async (item) => {
        const name = item.name;
        const i: Partial<ItemDoc2> = { name };
        if (item.categoryId) i.categoryId = item.categoryId;
        if (item.description) i.description = item.description;
        if (item.images) i.images = item.images;
        if (item.lastEaten) i.lastEaten = item.lastEaten;
        if (item.ratings) i.ratings = item.ratings;

        await addItem2(i as Omit<ItemDoc2, "id">);
        //addItem2(item);
    })
    return;
}