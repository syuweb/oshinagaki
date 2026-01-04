// app/components/MenuItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

interface MenuItemProps {
    item: {
        id: string;
        name: string;
        category: string;
        description: string;
        image: string;
        lastEaten?: string;
        ratings?: { name: string; score: number }[];
    };
}

export default function MenuItem({ item }: MenuItemProps) {
    return (
        <Link href={`/menu/${item.id}`} className="block active:bg-gray-100">
            <div className="flex items-center gap-3 px-3">
                <Image
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded object-cover flex-shrink-0"
                    width={150} height={150}
                />
                <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.lastEaten && (
                        <p className="text-xs text-gray-500">
                            最後に食べた日: {item.lastEaten}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}