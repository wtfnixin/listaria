import AdGrid from "../AdGrid";

export default function AdGridExample() {
  const mockAds = [
    {
      id: "1",
      title: "iPhone 14 Pro Max 256GB - Deep Purple",
      price: 89999,
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop",
      postedDate: "Today",
      isFeatured: true,
    },
    {
      id: "2",
      title: "MacBook Air M2 2023 - Space Gray",
      price: 119000,
      location: "Delhi",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      postedDate: "Yesterday",
    },
    {
      id: "3",
      title: "Honda City 2021 - Petrol - 25000km",
      price: 1150000,
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      postedDate: "2 days ago",
    },
    {
      id: "4",
      title: "Samsung Galaxy S23 Ultra - 512GB",
      price: 124999,
      location: "Chennai",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
      postedDate: "3 days ago",
    },
  ];
  
  return (
    <AdGrid
      ads={mockAds}
      title="All Ads"
      onAdClick={(id) => console.log("Ad clicked:", id)}
      onFavorite={(id) => console.log("Favorited:", id)}
    />
  );
}
