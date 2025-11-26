import AdCard from "./AdCard";
import EmptyState from "./EmptyState";

interface Ad {
  id: string;
  title: string;
  price: number;
  currency?: string;
  location: string;
  image: string;
  postedDate: string;
  isFeatured?: boolean;
}

interface AdGridProps {
  ads: Ad[];
  title?: string;
  onAdClick: (id: string) => void;
  onFavorite?: (id: string) => void;
  isLoading?: boolean;
}

export default function AdGrid({
  ads,
  title = "All Ads",
  onAdClick,
  onFavorite,
  isLoading = false,
}: AdGridProps) {
  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted aspect-[4/3] rounded-t-lg" />
                <div className="p-4 space-y-2 bg-card rounded-b-lg border border-t-0">
                  <div className="h-6 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (ads.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">{title}</h2>
          <EmptyState />
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-foreground mb-6" data-testid="text-ads-title">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onClick={onAdClick}
              onFavorite={onFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
