import { useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
}

const popularLocations = [
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
];

export default function LocationModal({
  isOpen,
  onClose,
  onLocationSelect,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = popularLocations.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    onLocationSelect(location);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Current location:", position.coords);
          onLocationSelect("Current Location");
          onClose();
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold" data-testid="text-location-title">
            Choose your location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search city, area or locality"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-location-search"
            />
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-primary"
            onClick={handleUseCurrentLocation}
            data-testid="button-current-location"
          >
            <Navigation className="w-4 h-4" />
            Use current location
          </Button>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Popular locations
            </p>
            <div className="space-y-1">
              {filteredLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  data-testid={`button-location-${location.toLowerCase().replace(/[,\s]+/g, "-")}`}
                >
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{location}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
