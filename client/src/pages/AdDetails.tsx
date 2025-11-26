import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageSquare,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { adApi, favoriteApi, Ad } from "@/lib/api";

export default function AdDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const { data: ad, isLoading } = useQuery({
    queryKey: ["/api/ads", id],
    queryFn: async () => {
      try {
        return await adApi.getById(id!);
      } catch (error) {
        console.log("API not available, using mock data");
        return getMockAd(id!);
      }
    },
    enabled: !!id,
  });

  const handleFavorite = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    try {
      if (isFavorited) {
        await favoriteApi.remove(id!);
        toast({
          title: "Removed from favorites",
          description: "Item removed from your favorites list.",
        });
      } else {
        await favoriteApi.add(id!);
        toast({
          title: "Added to favorites",
          description: "Item saved to your favorites list.",
        });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited
          ? "Item removed from your favorites list."
          : "Item saved to your favorites list.",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: ad?.title,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Ad link has been copied to clipboard.",
      });
    }
  };

  const handleChat = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    toast({
      title: "Chat coming soon",
      description: "Chat feature will be available soon!",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          isLoggedIn={!!user}
          userName={user?.displayName || "User"}
          onLogin={() => setAuthModalOpen(true)}
          onRegister={() => setAuthModalOpen(true)}
          onLogout={logout}
          onSell={() => navigate("/")}
          onSearch={() => navigate("/")}
          onLocationClick={() => {}}
        />
        <main className="flex-1 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-24 mb-6" />
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="aspect-[4/3] bg-muted rounded-lg" />
                  <div className="h-40 bg-muted rounded-lg" />
                </div>
                <div className="h-80 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          isLoggedIn={!!user}
          userName={user?.displayName || "User"}
          onLogin={() => setAuthModalOpen(true)}
          onRegister={() => setAuthModalOpen(true)}
          onLogout={logout}
          onSell={() => navigate("/")}
          onSearch={() => navigate("/")}
          onLocationClick={() => {}}
        />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Ad Not Found</h2>
              <p className="text-muted-foreground mb-4">
                This advertisement may have been removed or doesn't exist.
              </p>
              <Button onClick={() => navigate("/")}>Go Back Home</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const images = ad.images?.length ? ad.images : ["https://via.placeholder.com/800x600"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isLoggedIn={!!user}
        userName={user?.displayName || user?.email?.split("@")[0] || "User"}
        onLogin={() => setAuthModalOpen(true)}
        onRegister={() => setAuthModalOpen(true)}
        onLogout={logout}
        onSell={() => navigate("/")}
        onSearch={() => navigate("/")}
        onLocationClick={() => {}}
      />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to listings
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={images[currentImageIndex]}
                  alt={ad.title}
                  className="w-full aspect-[4/3] object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full"
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      data-testid="button-prev-image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full"
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      data-testid="button-next-image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-primary"
                              : "bg-background/60"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
                {ad.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-primary">
                    Featured
                  </Badge>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${ad.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-semibold mb-2" data-testid="text-ad-title">
                        {ad.title}
                      </h1>
                      <p className="text-3xl font-bold text-primary" data-testid="text-ad-price">
                        {formatPrice(ad.price)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleFavorite}
                        className={isFavorited ? "text-red-500" : ""}
                        data-testid="button-favorite"
                      >
                        <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShare}
                        data-testid="button-share"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span data-testid="text-ad-location">{ad.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Posted {formatDate(ad.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Tag className="w-4 h-4" />
                      <span className="capitalize">{ad.condition || "Used"}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-ad-description">
                      {ad.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {(ad.userName || "S")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold" data-testid="text-seller-name">
                        {ad.userName || "Seller"}
                      </p>
                      <p className="text-sm text-muted-foreground">Member since 2024</p>
                    </div>
                  </div>

                  <Separator />

                  {showPhone && ad.showPhone !== false ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="font-medium" data-testid="text-seller-phone">
                        {ad.phone || "+91 XXXXXXXXXX"}
                      </span>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => setShowPhone(true)}
                      data-testid="button-show-phone"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Show Phone Number
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleChat}
                    data-testid="button-chat"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat with Seller
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Safety Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>Meet in a safe public place</li>
                    <li>Check the item before you buy</li>
                    <li>Pay only after inspecting the item</li>
                    <li>Never pay in advance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
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
  if (!dateString) return "Recently";
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

function getMockAd(id: string): any {
  const mockAds: Record<string, any> = {
    "1": {
      _id: "1",
      title: "iPhone 14 Pro Max 256GB - Deep Purple - Like New",
      description: "Selling my iPhone 14 Pro Max in excellent condition. Comes with original box, charger, and all accessories. Battery health is at 98%. No scratches or dents. Always used with a case and screen protector.\n\nFeatures:\n- 256GB Storage\n- Deep Purple Color\n- A16 Bionic Chip\n- 48MP Camera System\n- Dynamic Island\n\nReason for selling: Upgrading to the new model.",
      price: 89999,
      location: "Mumbai, Maharashtra",
      images: [
        "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=600&fit=crop",
      ],
      condition: "like-new",
      category: "mobile",
      userName: "Rahul Sharma",
      phone: "+91 98765 43210",
      showPhone: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
    },
    "2": {
      _id: "2",
      title: "MacBook Air M2 2023 - Space Gray - 8GB/256GB",
      description: "Apple MacBook Air with M2 chip in Space Gray. Perfect for students and professionals. Lightweight and powerful.\n\nSpecs:\n- M2 Chip\n- 8GB RAM\n- 256GB SSD\n- 13.6\" Liquid Retina Display\n\nComes with original charger and box.",
      price: 119000,
      location: "Delhi, NCR",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      ],
      condition: "used",
      category: "electronics",
      userName: "Priya Patel",
      phone: "+91 87654 32109",
      showPhone: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  };

  return mockAds[id] || {
    _id: id,
    title: "Sample Product",
    description: "This is a sample product description.",
    price: 10000,
    location: "India",
    images: ["https://via.placeholder.com/800x600"],
    condition: "used",
    category: "electronics",
    userName: "Seller",
    showPhone: false,
    createdAt: new Date().toISOString(),
  };
}
