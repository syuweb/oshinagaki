export type Rating = {
    name: string;
    score: number;
};

// Firestoreに保存されている形（idなし）
export type ItemDoc = {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    lastEaten?: string;
    ratings?: Rating[];
};