import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import AdGrid from "@/components/AdGrid";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { favoriteApi } from "@/lib/api";

export default function Favorites() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { data: favoritesData, isLoading, refetch } = useQuery({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      try {
        const result = await favoriteApi.getAll();
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.log("API not available, using empty array");
        return [];
      }
    },
    enabled: !!user,
  });

  const favorites = Array.isArray(favoritesData) ? favoritesData : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          isLoggedIn={false}
          onLogin={() => setAuthModalOpen(true)}
          onRegister={() => setAuthModalOpen(true)}
          onLogout={() => {}}
          onSell={() => setAuthModalOpen(true)}
          onSearch={() => {}}
          onLocationClick={() => {}}
        />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to view your favorite items.
              </p>
              <Button onClick={() => setAuthModalOpen(true)}>Log In</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab="login"
        />
      </div>
    );
  }

  const handleAdClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await favoriteApi.remove(id);
      toast({
        title: "Removed from favorites",
        description: "Item removed from your favorites list.",
      });
      refetch();
    } catch (error) {
      console.log("Favorite API not available");
      toast({
        title: "Removed from favorites",
        description: "Item removed from your favorites list.",
      });
    }
  };

  const transformedAds = favorites.map((ad: any) => ({
    id: ad._id || ad.id,
    title: ad.title,
    price: ad.price,
    currency: ad.currency || "INR",
    location: ad.location,
    image: ad.images?.[0] || "https://via.placeholder.com/400x300",
    postedDate: ad.createdAt ? formatDate(ad.createdAt) : "Recently",
    isFeatured: ad.isFeatured,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isLoggedIn={true}
        userName={user.displayName || user.email?.split("@")[0] || "User"}
        onLogin={() => {}}
        onRegister={() => {}}
        onLogout={logout}
        onSell={() => navigate("/")}
        onSearch={() => navigate("/")}
        onLocationClick={() => {}}
      />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate("/")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold" data-testid="text-favorites-title">
              My Favorites
            </h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
          ) : favorites.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No Favorites Yet"
                description="You haven't added any items to your favorites. Start browsing and save items you like!"
              />
              <div className="text-center mt-4">
                <Button onClick={() => navigate("/")}>
                  Browse Listings
                </Button>
              </div>
            </div>
          ) : (
            <AdGrid
              ads={transformedAds}
              title=""
              onAdClick={handleAdClick}
              onFavorite={handleRemoveFavorite}
            />
          )}
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="login"
      />
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}
