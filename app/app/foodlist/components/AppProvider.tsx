import { CategoryListProvider } from "@/foodlist/components/CategoryList";
import { ItemPropertyProvider } from "@/foodlist/components/AddNewItem";

export async function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <CategoryListProvider>
            <ItemPropertyProvider>
                {children}
            </ItemPropertyProvider>
        </CategoryListProvider>
    );
}
