// app/page.tsx
import MenuList from "./components/MenuList"; // Client Component
import { getItems } from "../src/lib/items";

export default async function Page() {
  const items = await getItems();
  return <MenuList items={items} />;
}