import { collection, getDocs, addDoc } from "firebase/firestore";
//import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
//import cloudinary from "./cloudinary";
import { db } from "@/lib/firebase";
import type { ItemDoc } from "@/lib/item";

export async function getItems(): Promise<ItemDoc[]> {
    const snapshot = await getDocs(collection(db, "items"));

    return snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
            name: data.name ?? "",
            category: data.category ?? "",
            description: data.description ?? "",
            image: data.image ?? "",
            lastEaten: data.lastEaten,
            ratings: data.ratings ?? [],
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

export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "oshinagaki_unsigned_v2");

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Cloudinary error:", res.status, errorText);
        throw new Error("Cloudinary upload failed");
        //throw new Error("Cloudinary upload failed");
    }

    const data = await res.json();
    return data.secure_url as string;
}