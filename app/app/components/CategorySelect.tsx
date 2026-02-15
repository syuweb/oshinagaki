"use client";

import { useState } from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    existingCategories: string[];
};

export function CategorySelect({
    value,
    onChange,
    existingCategories,
}: Props) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="space-y-2">
            {!isCreating ? (
                <select
                    value={value}
                    onChange={(e) => {
                        if (e.target.value === "__new__") {
                            setIsCreating(true);
                            onChange("");
                        } else {
                            onChange(e.target.value);
                        }
                    }}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="">選択してください</option>

                    {existingCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}

                    <option value="__new__">＋ 新規カテゴリを作る</option>
                </select>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="カテゴリ名を入力"
                        className="flex-1 border rounded px-3 py-2"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="text-sm text-blue-600"
                    >
                        戻る
                    </button>
                </div>
            )}
        </div>
    );
}
