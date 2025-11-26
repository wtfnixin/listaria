import { useState } from "react";
import CategoryBar from "../CategoryBar";

export default function CategoryBarExample() {
  const [selected, setSelected] = useState("Electronics");
  const categories = ["Electronics", "Car", "Mobile", "CLOTHING"];
  
  return (
    <CategoryBar
      categories={categories}
      selectedCategory={selected}
      onCategorySelect={(cat) => {
        console.log("Category selected:", cat);
        setSelected(cat);
      }}
    />
  );
}
