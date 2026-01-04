// components/CategoryTabs.tsx

interface CategoryTabItem {
    label: string;
    value: string;
}

interface CategoryTabsProps {
    categories: CategoryTabItem[]; // string[] → CategoryTabItem[]
    selected: string;
    onChange: (cat: string) => void;
}

// props は関数コンポーネントの引数で受け取る
export default function CategoryTabs({ categories, selected, onChange }: CategoryTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
            {categories.map(cat => (
                <button
                    key={cat.value}
                    className={`inline-block px-4 py-2 rounded-lg transition-transform border-2 ${cat.value === selected
                            ? "bg-blue-500 text-white border-blue-700 scale-105"
                            : "bg-gray-200 text-black border-gray-300"
                        }`}
                    onClick={() => onChange(cat.value)}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}