// app/page.tsx
import MenuList from "@/components/MenuList"; // Client Component
import { getItems } from "@/lib/items";
import AppContainer from "@/components/AppContainer"

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await getItems();
  return (
    <AppContainer>
      <MenuList items={items} />
    </AppContainer>
  );
}
