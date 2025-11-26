import { MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

interface AdCardProps {
  ad: Ad;
  onClick: (id: string) => void;
  onFavorite?: (id: string) => void;
}

export default function AdCard({ ad, onClick, onFavorite }: AdCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(ad.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: ad.currency || "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer group hover-elevate transition-all"
      onClick={() => onClick(ad.id)}
      data-testid={`card-ad-${ad.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {ad.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full ${
            isFavorited ? "text-red-500" : "text-muted-foreground"
          }`}
          onClick={handleFavorite}
          data-testid={`button-favorite-${ad.id}`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
      </div>
      <div className="p-4">
        <p className="text-xl font-bold text-primary mb-1" data-testid={`text-price-${ad.id}`}>
          {formatPrice(ad.price)}
        </p>
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2" data-testid={`text-title-${ad.id}`}>
          {ad.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span data-testid={`text-location-${ad.id}`}>{ad.location}</span>
          </div>
          <span data-testid={`text-date-${ad.id}`}>{ad.postedDate}</span>
        </div>
      </div>
    </Card>
  );
}
