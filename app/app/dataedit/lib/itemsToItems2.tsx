import { ItemDoc } from "@/lib/item";
import { ItemDoc2, FoodCategoryDoc, RATING_NAMES, Rating } from "@/foodlist/lib/firestoreDoc";
import { getFoodCategories, AddFoodCategory } from "@/foodlist/lib/foodCategory";
import { uploadToCloudinary } from "@/dataedit/action/cloudinary";


export async function translateItemsToItems2(
    items: ItemDoc[]
): Promise<ItemDoc2[]> {
    const normalizeCategory = (category?: string) =>
        category?.trim() || undefined;

    // 既存カテゴリ取得
    const categories = await getFoodCategories();

    // Itemに存在するカテゴリ名一覧（重複除去）
    const categoryNames = [
        ...new Set(
            items
                .map(item => normalizeCategory(item.category))
                .filter((name): name is string => !!name)
        ),
    ];

    // 存在しないカテゴリを追加
    for (const catName of categoryNames) {
        if (!categories.some(cat => cat.name === catName)) {
            const newCategory: Omit<FoodCategoryDoc, "id"> = {
                name: catName,
                order: categories.length,
            };

            const docRef = await AddFoodCategory(categories, newCategory);

            categories.push({
                id: docRef.id,
                ...newCategory,
            });
        }
    }

    // ItemDoc → ItemDoc2へ変換
    return await Promise.all(
        items.map(async (item) => {
            const categoryId =
                categories.find(cat => cat.name === normalizeCategory(item.category))
                    ?.id;

            const images = item.image
                ? [
                    {
                        url: item.image.url,
                        publicId: item.image.publicId,
                        createdAt: "",
                    },
                ]
                : undefined;

            if (images?.[0]) {
                const { url, publicId } = await uploadToCloudinary(images[0].url);

                images[0].url = url;
                images[0].publicId = publicId;
            }

            const defaultRatings: Rating[] = RATING_NAMES.map((name) => ({
                name,
                score: 0,
            }));

            const id = item.id;
            const name = item.name;
            const item2: ItemDoc2 = { id, name };
            if (categoryId) item2.categoryId = categoryId;
            if (item.description) item2.description = item.description;
            if (images) item2.images = images;
            if (item.lastEaten) item2.lastEaten = item.lastEaten;
            if (item.ratings) item2.ratings = item.ratings; else item2.ratings = defaultRatings;

            return item2;
        })
    );
}



/*
export function TranslateItemsToItems2(items: ItemDoc[]) {
    const [categories, setCategories] = useState<FoodCategoryDoc[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getFoodCategories();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    const normalizeCategory = (category?: string) =>
        category?.trim() || undefined

    const categoryNames = [
        ...Array.from(
            new Set(items.map(item => normalizeCategory(item.category)))
        ),
    ];

    const addNewCategories = async (name: string) => {
        const newCategory: Omit<FoodCategoryDoc, "id"> = {
            name,
            order: 0,
        };
        const docRef = await AddFoodCategory(categories, newCategory as Omit<FoodCategoryDoc, "id">);
        // カテゴリーリストの更新
        setCategories((prev) => {
            // 先頭に新カテゴリーを追加
            const updated = [
                {
                    id: docRef.id,
                    ...newCategory,
                },
                ...prev,
            ];
            // orderの振りなおし。順番に並んでいるので、0から順番に振っていく。
            return updated.map((item, index) => ({
                ...item,
                order: index,
            }));
        });
    }

    categoryNames.map((catName) => {
        if (catName && !categories.some(cat => cat.name === catName)) {
            addNewCategories(catName);
        }
    });

    const items2: ItemDoc2[] = (
        items.map((item) => {
            const categoryId = categories.find(cat => cat.name === item.category)?.id;

            const images: ItemImage[] | undefined = item.image && [
                {
                    url: item.image.url,
                    publicId: item.image.publicId,
                    createdAt: "",
                },
            ];

            return {
                id: item.id,
                name: item.name,
                categoryId: categoryId,
                description: item.description,
                images: images,
                lastEaten: item.lastEaten,
                ratings: item.ratings,
            };
        })
    );

    return items2;
}
*/