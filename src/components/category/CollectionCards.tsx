import type { Category } from "../../data/products";
import CollectionTile from "./CollectionTile";

export default function CollectionCards({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-[230px] md:auto-rows-[300px] gap-3 md:gap-5">
      {categories.map((category) => (
        <CollectionTile key={category.slug} category={category} />
      ))}
    </div>
  );
}
