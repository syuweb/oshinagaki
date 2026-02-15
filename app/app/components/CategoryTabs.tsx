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
export default function CategoryTabs({
    categories,
    selected,
    onChange,
}: CategoryTabsProps) {
    return (
        <div className="border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto whitespace-nowrap px-3 gap-0">
                {categories.map((cat) => {
                    const isActive = cat.value === selected;

                    return (
                        <button
                            key={cat.value}
                            onClick={() => onChange(cat.value)}
                            className={`
                min-h-[44px]
                px-4
                text-sm
                rounded-t-md
                border
                ${isActive
                                    ? "bg-white border-gray-200 border-b-white text-black z-10"
                                    //: "bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200"
                                    : "bg-gray-100 border-transparent text-gray-500 mt-1"
                                }
              `}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
