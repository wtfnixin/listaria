import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import PopularCategories from "@/components/PopularCategories";
import AdGrid from "@/components/AdGrid";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import LocationModal from "@/components/LocationModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { adApi, Ad, AdFilters } from "@/lib/api";
import { useLocation } from "wouter";

const categories = ["Electronics", "Car", "Mobile", "CLOTHING"];

const popularCategories = [
  { id: "electronics", name: "Electronics", icon: "electronics" as const },
  { id: "car", name: "Car", icon: "car" as const },
  { id: "mobile", name: "Mobile", icon: "mobile" as const },
  { id: "clothing", name: "CLOTHING", icon: "clothing" as const },
];

export default function Home() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCat, setSearchCat] = useState("all");
  const [location, setLocation] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const filters: AdFilters = {
    category: selectedCategory || (searchCat !== "all" ? searchCat : undefined),
    search: searchQuery || undefined,
    location: location || undefined,
  };

  const { data: adsData, isLoading, refetch } = useQuery({
    queryKey: ["/api/ads", filters],
    queryFn: async () => {
      try {
        return await adApi.getAll(filters);
      } catch (error) {
        console.log("API not available, using mock data");
        return { ads: getMockAds(), total: 8, page: 1 };
      }
    },
  });

  const ads = adsData?.ads || [];

  const filteredAds = ads.filter((ad: any) => {
    const matchesCategory =
      !selectedCategory || ad.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      ad.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearchCat =
      searchCat === "all" || ad.category?.toLowerCase() === searchCat.toLowerCase();
    return matchesCategory && matchesSearch && matchesSearchCat;
  });

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSearchCat(category);
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategory.toLowerCase() === category.toLowerCase()) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category.toLowerCase());
    }
  };

  const handlePopularCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleAdClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  const handleFavorite = async (id: string) => {
    toast({
      title: "Added to favorites",
      description: "Item saved to your favorites list.",
    });
  };

  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    toast({
      title: "Location updated",
      description: `Showing results for ${loc}`,
    });
  };

  const transformedAds = filteredAds.map((ad: any) => ({
    id: ad._id || ad.id,
    title: ad.title,
    price: ad.price,
    currency: ad.currency || "INR",
    location: ad.location,
    image: ad.images?.[0] || ad.image || "https://via.placeholder.com/400x300",
    postedDate: ad.createdAt ? formatDate(ad.createdAt) : ad.postedDate || "Recently",
    isFeatured: ad.isFeatured,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isLoggedIn={!!user}
        userName={user?.displayName || user?.email?.split("@")[0] || "User"}
        onLogin={() => setAuthModalOpen(true)}
        onRegister={() => setAuthModalOpen(true)}
        onLogout={logout}
        onSell={() => {
          if (!user) {
            setAuthModalOpen(true);
            toast({
              title: "Login required",
              description: "Please log in to post an advertisement.",
            });
            return;
          }
        }}
        onSearch={handleSearch}
        onLocationClick={() => setLocationModalOpen(true)}
      />

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <main className="flex-1">
        <PopularCategories
          categories={popularCategories}
          onCategoryClick={handlePopularCategoryClick}
        />

        <AdGrid
          ads={transformedAds}
          title="All Ads"
          onAdClick={handleAdClick}
          onFavorite={handleFavorite}
          isLoading={isLoading}
        />
      </main>

      <Footer />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSelect={handleLocationSelect}
      />

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

function getMockAds() {
  return [
    {
      id: "1",
      _id: "1",
      title: "iPhone 14 Pro Max 256GB - Deep Purple - Like New",
      price: 89999,
      location: "Mumbai, Maharashtra",
      images: ["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop"],
      postedDate: "Today",
      isFeatured: true,
      category: "mobile",
    },
    {
      id: "2",
      _id: "2",
      title: "MacBook Air M2 2023 - Space Gray - 8GB/256GB",
      price: 119000,
      location: "Delhi, NCR",
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"],
      postedDate: "Yesterday",
      category: "electronics",
    },
    {
      id: "3",
      _id: "3",
      title: "Honda City 2021 ZX CVT - Petrol - 25000km - First Owner",
      price: 1150000,
      location: "Bangalore, Karnataka",
      images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop"],
      postedDate: "2 days ago",
      category: "car",
    },
    {
      id: "4",
      _id: "4",
      title: "Samsung Galaxy S23 Ultra 512GB - Phantom Black",
      price: 124999,
      location: "Chennai, Tamil Nadu",
      images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop"],
      postedDate: "3 days ago",
      category: "mobile",
    },
    {
      id: "5",
      _id: "5",
      title: "Sony WH-1000XM5 Wireless Headphones - Black",
      price: 29990,
      location: "Hyderabad, Telangana",
      images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop"],
      postedDate: "4 days ago",
      category: "electronics",
    },
    {
      id: "6",
      _id: "6",
      title: "Maruti Swift VXI 2020 - Petrol - 18000km",
      price: 650000,
      location: "Pune, Maharashtra",
      images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"],
      postedDate: "5 days ago",
      category: "car",
    },
    {
      id: "7",
      _id: "7",
      title: "Nike Air Jordan 1 Retro High - Chicago - Size 10",
      price: 18999,
      location: "Mumbai, Maharashtra",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"],
      postedDate: "1 week ago",
      category: "clothing",
    },
    {
      id: "8",
      _id: "8",
      title: "Dell XPS 15 - i7 12th Gen - 16GB/512GB",
      price: 145000,
      location: "Kolkata, West Bengal",
      images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop"],
      postedDate: "1 week ago",
      isFeatured: true,
      category: "electronics",
    },
  ];
}
