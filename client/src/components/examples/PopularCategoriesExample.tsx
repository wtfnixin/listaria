import PopularCategories from "../PopularCategories";

export default function PopularCategoriesExample() {
  const categories = [
    { id: "electronics", name: "Electronics", icon: "electronics" as const },
    { id: "car", name: "Car", icon: "car" as const },
    { id: "mobile", name: "Mobile", icon: "mobile" as const },
    { id: "clothing", name: "CLOTHING", icon: "clothing" as const },
  ];
  
  return (
    <PopularCategories
      categories={categories}
      onCategoryClick={(id) => console.log("Category clicked:", id)}
    />
  );
}
