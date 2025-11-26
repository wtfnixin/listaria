import { useState } from "react";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import PopularCategories from "@/components/PopularCategories";
import AdGrid from "@/components/AdGrid";
import Footer from "@/components/Footer";
import SellModal from "@/components/SellModal";
import AuthModal from "@/components/AuthModal";
import LocationModal from "@/components/LocationModal";
import { useToast } from "@/hooks/use-toast";

const categories = ["Electronics", "Car", "Mobile", "CLOTHING"];

const popularCategories = [
  { id: "electronics", name: "Electronics", icon: "electronics" as const },
  { id: "car", name: "Car", icon: "car" as const },
  { id: "mobile", name: "Mobile", icon: "mobile" as const },
  { id: "clothing", name: "CLOTHING", icon: "clothing" as const },
];

// todo: remove mock functionality - replace with real API data
const mockAds = [
  {
    id: "1",
    title: "iPhone 14 Pro Max 256GB - Deep Purple - Like New",
    price: 89999,
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop",
    postedDate: "Today",
    isFeatured: true,
    category: "mobile",
  },
  {
    id: "2",
    title: "MacBook Air M2 2023 - Space Gray - 8GB/256GB",
    price: 119000,
    location: "Delhi, NCR",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    postedDate: "Yesterday",
    category: "electronics",
  },
  {
    id: "3",
    title: "Honda City 2021 ZX CVT - Petrol - 25000km - First Owner",
    price: 1150000,
    location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    postedDate: "2 days ago",
    category: "car",
  },
  {
    id: "4",
    title: "Samsung Galaxy S23 Ultra 512GB - Phantom Black",
    price: 124999,
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
    postedDate: "3 days ago",
    category: "mobile",
  },
  {
    id: "5",
    title: "Sony WH-1000XM5 Wireless Headphones - Black",
    price: 29990,
    location: "Hyderabad, Telangana",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop",
    postedDate: "4 days ago",
    category: "electronics",
  },
  {
    id: "6",
    title: "Maruti Swift VXI 2020 - Petrol - 18000km",
    price: 650000,
    location: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    postedDate: "5 days ago",
    category: "car",
  },
  {
    id: "7",
    title: "Nike Air Jordan 1 Retro High - Chicago - Size 10",
    price: 18999,
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    postedDate: "1 week ago",
    category: "clothing",
  },
  {
    id: "8",
    title: "Dell XPS 15 - i7 12th Gen - 16GB/512GB",
    price: 145000,
    location: "Kolkata, West Bengal",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop",
    postedDate: "1 week ago",
    isFeatured: true,
    category: "electronics",
  },
];

export default function Home() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCat, setSearchCat] = useState("all");
  const [location, setLocation] = useState("");
  
  // todo: remove mock functionality - replace with Firebase auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "register">("login");
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const filteredAds = mockAds.filter((ad) => {
    const matchesCategory =
      !selectedCategory || ad.category === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearchCat =
      searchCat === "all" || ad.category === searchCat;
    return matchesCategory && matchesSearch && matchesSearchCat;
  });

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSearchCat(category);
    console.log("Searching:", query, "in category:", category);
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  const handlePopularCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleAdClick = (id: string) => {
    console.log("Ad clicked:", id);
    toast({
      title: "Opening ad details",
      description: "Ad detail page coming soon!",
    });
  };

  const handleFavorite = (id: string) => {
    if (!isLoggedIn) {
      setAuthDefaultTab("login");
      setAuthModalOpen(true);
      return;
    }
    console.log("Favorited:", id);
    toast({
      title: "Added to favorites",
      description: "Item saved to your favorites list.",
    });
  };

  const handleLogin = (email: string, password: string) => {
    // todo: remove mock functionality - replace with Firebase auth
    console.log("Login:", email, password);
    setIsLoggedIn(true);
    setUserName(email.split("@")[0].toUpperCase());
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // todo: remove mock functionality - replace with Firebase auth
    console.log("Register:", name, email, password);
    setIsLoggedIn(true);
    setUserName(name.toUpperCase());
    toast({
      title: "Account created!",
      description: "Welcome to Listaria.",
    });
  };

  const handleLogout = () => {
    // todo: remove mock functionality - replace with Firebase auth
    setIsLoggedIn(false);
    setUserName("");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const handleSell = () => {
    if (!isLoggedIn) {
      setAuthDefaultTab("login");
      setAuthModalOpen(true);
      toast({
        title: "Login required",
        description: "Please log in to post an advertisement.",
      });
      return;
    }
    setSellModalOpen(true);
  };

  const handleSellSubmit = (data: any) => {
    console.log("Ad submitted:", data);
    toast({
      title: "Ad published!",
      description: "Your advertisement has been posted successfully.",
    });
  };

  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    toast({
      title: "Location updated",
      description: `Showing results for ${loc}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogin={() => {
          setAuthDefaultTab("login");
          setAuthModalOpen(true);
        }}
        onRegister={() => {
          setAuthDefaultTab("register");
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onSell={handleSell}
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
          ads={filteredAds}
          title="All Ads"
          onAdClick={handleAdClick}
          onFavorite={handleFavorite}
        />
      </main>

      <Footer />

      <SellModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onSubmit={handleSellSubmit}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
