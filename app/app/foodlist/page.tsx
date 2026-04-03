import TopContainer from "./components/TopContainer";
import FoodList from "./components/FoodList";
import { getItems } from "./lib/items";

export default async function Home() {
    const items = await getItems();

    return (
        <TopContainer>
            <FoodList items={items} />
        </TopContainer>
    );
}
