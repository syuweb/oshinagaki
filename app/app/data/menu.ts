// app/data/menu.ts

export interface Rating {
    name: string;  // 評価者
    score: number; // 評価値
}

export interface Menu {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    lastEaten?: string; // YYYY-MM-DD 形式
    ratings?: Rating[]; // 複数人分の評価
}

export const menuItems: Menu[] = [
    {
        id: "1",
        name: "うどん",
        category: "和食",
        description: "スパイシーでコクのあるうどん。",
        image: "/images/udon.jpg",
        lastEaten: "2025-12-03",
        ratings: [
            { name: "太郎", score: 4 },
            { name: "花子", score: 5 },
            { name: "次郎", score: 5 }
        ]
    },
    {
        id: "2",
        name: "寿司",
        category: "和食",
        description: "スパイシーでコクのある寿司。",
        image: "/images/sushi.jpg",
        lastEaten: "2025-12-01",
        ratings: [
            { name: "太郎", score: 2 },
            { name: "花子", score: 5 },
            { name: "次郎", score: 3 }
        ]
    },
    {
        id: "3",
        name: "天ぷら",
        category: "和食",
        description: "スパイシーでコクのある天ぷら。",
        image: "/images/tempura.jpg",
        lastEaten: "2025-12-09",
        ratings: [
            { name: "太郎", score: 3 },
            { name: "花子", score: 3 },
            { name: "次郎", score: 3 }
        ]
    },
    {
        id: "4",
        name: "ハンバーグ",
        category: "洋食",
        description: "ジューシーな手作りハンバーグ。",
        image: "/images/hamburg.jpg",
        lastEaten: "2025-12-06",
        ratings: [
            { name: "太郎", score: 1 },
            { name: "花子", score: 2 },
            { name: "次郎", score: 2 }
        ]
    },
    // 必要に応じて追加
];