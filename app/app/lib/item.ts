export const RATING_NAMES = ["かずみ", "しゅう", "ゆうた"] as const;

export type RatingName = (typeof RATING_NAMES)[number];

export type Rating = {
    name: RatingName;
    score: number;
};

// Firestoreに保存されている形（idなし）
export type ItemDoc = {
    id: string;
    name: string;
    category?: string;
    description?: string;

    image?: {
        url: string;
        publicId: string;
    };

    lastEaten?: string;
    ratings?: Rating[];
};