import { doc, collection, getDocs, getDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ItemDoc, Rating, RatingName } from "@/lib/item";
import { RATING_NAMES } from "@/lib/item";

export async function getItems(): Promise<ItemDoc[]> {
    const snapshot = await getDocs(collection(db, "items"));

    return snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
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
    });
}

export async function addItem(
    item: Omit<ItemDoc, "id">
) {
    await addDoc(collection(db, "items"), item);
}

export async function deleteItem(itemId: string) {
    const ref = doc(db, "items", itemId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();
    if (data.image?.publicId) {
        console.log("before delete cloudinary:", data.image.publicId);
        await fetch("/api/cloudinary/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                publicId: data.image.publicId,
            }),
        });
        console.log("after delete cloudinary:", data.image.publicId);
    }

    await deleteDoc(ref);
}

export async function saveRating(
    itemId: string,
    currentRatings: Rating[],
    ratingName: RatingName,
    score: number
) {
    const ref = doc(db, "items", itemId);

    const nextRatings: Rating[] = RATING_NAMES.map((name) => {
        if (name === ratingName) {
            return { name, score };
        }
        const existing = currentRatings.find((r) => r.name === name);
        return {
            name,
            score: existing?.score ?? 0,
        };
    });

    await updateDoc(ref, {
        ratings: nextRatings,
    });
}

export async function uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    return res.json();
}
