interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryBar({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryBarProps) {
  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`text-sm whitespace-nowrap transition-colors hover-elevate px-2 py-1 rounded ${
                selectedCategory === category
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
