import { useState } from "react";
import { Search, MapPin, ChevronDown, User, Bell, MessageSquare, CreditCard, Heart, Receipt, Star, Briefcase, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onSell: () => void;
  onSearch: (query: string, category: string) => void;
  onLocationClick: () => void;
}

export default function Header({
  isLoggedIn,
  userName = "User",
  onLogin,
  onRegister,
  onLogout,
  onSell,
  onSearch,
  onLocationClick,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery, category);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-foreground flex items-center" data-testid="logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mr-1">
                <path d="M8 8C8 5.79086 9.79086 4 12 4H20C22.2091 4 24 5.79086 24 8V24C24 26.2091 22.2091 28 20 28H12C9.79086 28 8 26.2091 8 24V8Z" fill="#B078C4"/>
                <path d="M12 12H20M12 16H18M12 20H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xl gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[140px] border-r-0 rounded-r-none" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search any products"
                  className="pl-9 rounded-l-none rounded-r-none border-x-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  data-testid="input-search"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="rounded-l-none bg-primary hover:bg-primary/90"
                data-testid="button-search"
              >
                <Search className="w-4 h-4 mr-1" />
                Search
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLocationClick}
              className="text-muted-foreground"
              data-testid="button-location"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Add Location
            </Button>

            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1" data-testid="button-user-menu">
                      <User className="w-4 h-4" />
                      <span className="max-w-[100px] truncate">{userName}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem data-testid="menu-profile">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-notifications">
                      <Bell className="w-4 h-4 mr-2" />
                      Notification
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-chat">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-subscription">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-my-ads">
                      <Receipt className="w-4 h-4 mr-2" />
                      My Advertisement
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-favorites">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-transactions">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Transaction
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-reviews">
                      <Star className="w-4 h-4 mr-2" />
                      Reviews
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-jobs">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Job Applications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-destructive" data-testid="menu-logout">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={onLogin} data-testid="button-login">
                  Log in
                </Button>
                <span className="text-muted-foreground">|</span>
                <Button variant="ghost" size="sm" onClick={onRegister} data-testid="button-register">
                  Register
                </Button>
              </>
            )}

            <Button onClick={onSell} className="bg-primary hover:bg-primary/90" data-testid="button-sell">
              + Sell
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1" data-testid="button-language">
                  <span className="text-lg">🌐</span>
                  en
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Hindi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-4">
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 flex">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="rounded-r-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch} className="rounded-l-none bg-primary">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={onLocationClick}>
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </Button>
              {isLoggedIn ? (
                <>
                  <Button variant="outline" size="sm">Profile</Button>
                  <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={onLogin}>Log in</Button>
                  <Button variant="outline" size="sm" onClick={onRegister}>Register</Button>
                </>
              )}
              <Button onClick={onSell} className="bg-primary">+ Sell</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
