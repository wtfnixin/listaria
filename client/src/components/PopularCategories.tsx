import { Laptop, Car, Smartphone, Shirt, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  icon: "electronics" | "car" | "mobile" | "clothing";
  image?: string;
}

interface PopularCategoriesProps {
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
}

const iconMap = {
  electronics: Laptop,
  car: Car,
  mobile: Smartphone,
  clothing: Shirt,
};

const categoryImages: Record<string, string> = {
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
  car: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=200&fit=crop",
  mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop",
  clothing: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
};

export default function PopularCategories({
  categories,
  onCategoryClick,
}: PopularCategoriesProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("categories-container");
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground" data-testid="text-popular-categories">
            Popular Categories
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full"
              data-testid="button-scroll-left"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-scroll-right"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          id="categories-container"
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        >
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            const imageUrl = category.image || categoryImages[category.icon];
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className="flex flex-col items-center gap-3 min-w-[100px] group"
                data-testid={`category-icon-${category.id}`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-border overflow-hidden transition-all group-hover:border-primary group-hover:scale-105">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
