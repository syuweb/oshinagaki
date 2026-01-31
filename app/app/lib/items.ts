import { doc, collection, getDocs, getDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
//import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { deleteFromCloudinary } from "./cloudinary";
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

//const storage = getStorage();

//export async function uploadImage(file: File): Promise<string> {
//    const storageRef = ref(storage, `items/${file.name}`);
//    await uploadBytes(storageRef, file);
//    const url = await getDownloadURL(storageRef);
//    return url;
//}

export type UploadResult = {
    imageUrl: string;
    imagePublicId: string;
};

export async function uploadToCloudinary(file: File): Promise<UploadResult> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "oshinagaki/items");

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Cloudinary error:", res.status, errorText);
        throw new Error(`Cloudinary upload failed: ${res.status} ${errorText}`);
        //throw new Error("Cloudinary upload failed");
    }

    const data = await res.json();
    return {
        imageUrl: data.secure_url,
        imagePublicId: data.public_id,
    };
}

/*
export async function deleteFromCloudinary(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result); // { result: 'ok' } が成功
}
*/

export async function deleteItem(itemId: string) {
    const ref = doc(db, "items", itemId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();
    if (data.imagePublicId) {
        await deleteFromCloudinary(data.imagePublicId);
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

/*
export async function saveRating(
    itemId: string,
    ratingName: string,
    score: number
) {
    const ref = doc(db, "items", itemId);

    await updateDoc(ref, {
        ratings: [
            {
                name: ratingName,
                score,
            },
        ],
    });
}
*/