import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export type Item = {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    lastEaten?: string;
    ratings?: { name: string; score: number }[];
};

export async function getItems(): Promise<Item[]> {
    const snapshot = await getDocs(collection(db, "items"));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || "",
            category: data.category || "",
            description: data.description || "",
            image: data.image || "",
            lastEaten: data.lastEaten,
            ratings: data.ratings || [],
        } as Item;
    });
}