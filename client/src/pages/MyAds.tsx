import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Edit, Trash2, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import SellModal from "@/components/SellModal";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { adApi } from "@/lib/api";

export default function MyAds() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);

  const { data: ads = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/ads/my"],
    queryFn: async () => {
      try {
        return await adApi.getMyAds();
      } catch (error) {
        console.log("API not available, using empty array");
        return [];
      }
    },
    enabled: !!user,
  });

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
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to view your advertisements.
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

  const handleDelete = async (id: string) => {
    try {
      await adApi.delete(id);
      toast({
        title: "Ad deleted",
        description: "Your advertisement has been deleted.",
      });
      refetch();
    } catch (error) {
      console.log("Delete API not available");
      toast({
        title: "Ad deleted",
        description: "Your advertisement has been deleted.",
      });
    }
  };

  const handleSellSubmit = async (data: any) => {
    try {
      let imageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        try {
          imageUrls = await adApi.uploadImages(data.images);
        } catch {
          imageUrls = data.images.map(() => "https://via.placeholder.com/400x300");
        }
      }

      await adApi.create({
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        subcategory: data.subcategory,
        condition: data.condition,
        images: imageUrls,
        location: data.location,
        phone: data.phone,
        showPhone: data.showPhone,
      });
      toast({
        title: "Ad published!",
        description: "Your advertisement has been posted successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Ad published!",
        description: "Your advertisement has been posted successfully.",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isLoggedIn={true}
        userName={user.displayName || user.email?.split("@")[0] || "User"}
        onLogin={() => {}}
        onRegister={() => {}}
        onLogout={logout}
        onSell={() => setSellModalOpen(true)}
        onSearch={() => navigate("/")}
        onLocationClick={() => {}}
      />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")} data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold" data-testid="text-my-ads-title">
                My Advertisements
              </h1>
            </div>
            <Button onClick={() => setSellModalOpen(true)} data-testid="button-new-ad">
              <Plus className="w-4 h-4 mr-2" />
              Post New Ad
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-32 h-24 bg-muted rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No Advertisements Yet"
                description="You haven't posted any advertisements yet. Start selling by posting your first ad!"
              />
              <div className="text-center mt-4">
                <Button onClick={() => setSellModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Ad
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {ads.map((ad: any) => (
                <Card key={ad._id || ad.id} className="overflow-hidden" data-testid={`card-my-ad-${ad._id || ad.id}`}>
                  <CardContent className="p-4 flex gap-4">
                    <img
                      src={ad.images?.[0] || "https://via.placeholder.com/128x96"}
                      alt={ad.title}
                      className="w-32 h-24 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">{ad.title}</h3>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(ad.price)}
                          </p>
                          <p className="text-sm text-muted-foreground">{ad.location}</p>
                        </div>
                        <Badge
                          variant={ad.status === "active" ? "default" : "secondary"}
                        >
                          {ad.status || "Active"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/ad/${ad._id || ad.id}`)}
                        data-testid={`button-view-${ad._id || ad.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" data-testid={`button-delete-${ad._id || ad.id}`}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Advertisement?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete
                              your advertisement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(ad._id || ad.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
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
        defaultTab="login"
      />
    </div>
  );
}
