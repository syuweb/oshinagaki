import { TitleProvider } from "@/components/Title";
import { MenuItemsProvider } from "@/components/MenuItems";
import { SubBarProvider } from "@/components/SubBar";
import { BottomBarProvider } from "@/components/BottomBar";
import { ActionProvider } from "@/components/Action";

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <TitleProvider>
            <MenuItemsProvider>
                <SubBarProvider>
                    <BottomBarProvider>
                        <ActionProvider>
                            {children}
                        </ActionProvider>
                    </BottomBarProvider>
                </SubBarProvider>
            </MenuItemsProvider>
        </TitleProvider>
    );
}
