import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Share2, Edit3, User } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { RestaurantCard } from "@/components/restaurant-card";
import { MapSection } from "@/components/map-section";
import { ReviewModal } from "@/components/review-modal";
import { useUserCookie } from "@/hooks/use-user-cookie";
import { useToast } from "@/hooks/use-toast";
import type { RestaurantWithStats } from "@shared/schema";

interface PopularMenuItem {
  id: number;
  name: string;
  price: number;
  restaurantName: string;
  imageUrl?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<{ id: number; name: string } | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  
  const userCookie = useUserCookie();
  const { toast } = useToast();

  const { data: restaurants = [], isLoading: loadingRestaurants } = useQuery<RestaurantWithStats[]>({
    queryKey: ["/api/restaurants", currentFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (currentFilter !== "all") params.append("genre", currentFilter);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/restaurants?${params}`);
      if (!response.ok) throw new Error("Failed to fetch restaurants");
      return response.json();
    },
  });

  const { data: popularMenus = [] } = useQuery<PopularMenuItem[]>({
    queryKey: ["/api/menu-items/popular"],
  });

  const { data: bookmarks = [] } = useQuery<RestaurantWithStats[]>({
    queryKey: ["/api/bookmarks"],
    queryFn: async () => {
      if (!userCookie) return [];
      const response = await fetch("/api/bookmarks", {
        headers: {
          "X-User-Cookie": userCookie,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch bookmarks");
      return response.json();
    },
    enabled: !!userCookie,
  });

  const featuredRestaurants = restaurants.slice(0, 3);
  const stats = {
    totalRestaurants: restaurants.length,
    totalReviews: restaurants.reduce((sum, r) => sum + r.reviewCount, 0),
    nearbyCount: restaurants.length,
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (genre: string) => {
    setCurrentFilter(genre);
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "まちの推しグルメMAP",
          text: "射水市の美味しいお店を発見しよう！",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "URLをコピーしました",
          description: "クリップボードにURLがコピーされました",
        });
      } catch (err) {
        toast({
          title: "エラー",
          description: "URLのコピーに失敗しました",
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenReviewModal = () => {
    if (featuredRestaurants.length > 0) {
      setSelectedRestaurant({
        id: featuredRestaurants[0].id,
        name: featuredRestaurants[0].name,
      });
      setShowReviewModal(true);
    }
  };

  const handleBookmarkToggle = (restaurantId: number, isBookmarked: boolean) => {
    setBookmarkCount(prev => isBookmarked ? prev + 1 : prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile only, hidden on desktop */}
      <header className="bg-white shadow-md sticky top-0 z-40 md:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-800">まちの推しグルメMAP</h1>
                <p className="text-xs text-gray-600">射水市の学生向けグルメ発見</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-gray-600 hover:text-primary"
              >
                <Heart className="w-5 h-5" />
                {bookmarks.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-danger text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {bookmarks.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-600 hover:text-primary"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ホーム</h1>
              <p className="text-sm text-gray-600">射水市の美味しいお店を発見しよう</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>登録店舗:</span>
                <span className="font-semibold text-primary">{stats.totalRestaurants}店舗</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-600 hover:text-primary"
              >
                <Heart className="w-5 h-5 mr-2" />
                <span>お気に入り</span>
                {bookmarks.length > 0 && (
                  <Badge className="ml-2 bg-danger text-white text-xs">
                    {bookmarks.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        currentFilter={currentFilter}
        onToggleMap={() => {}}
        onGetLocation={() => {
          toast({
            title: "位置情報を取得中...",
            description: "現在地周辺のお店を検索しています",
          });
        }}
      />

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-primary to-accent py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
              <div className="text-sm opacity-90">登録店舗</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <div className="text-sm opacity-90">レビュー数</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.nearbyCount}</div>
              <div className="text-sm opacity-90">周辺店舗</div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-6 py-6">
        {/* Desktop Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">今週の推しグルメ</h2>
                <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium">
                  もっと見る
                </Button>
              </div>
              
              {loadingRestaurants ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-300"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      variant="featured"
                      onToggleBookmark={handleBookmarkToggle}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Restaurant List */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">周辺のお店</h2>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="distance">距離順</option>
                  <option value="rating">評価順</option>
                  <option value="popular">人気順</option>
                  <option value="newest">新着順</option>
                </select>
              </div>

              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    variant="list"
                    onToggleBookmark={handleBookmarkToggle}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="outline" className="px-6 py-3">
                  もっと読み込む
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Map Section */}
            <MapSection />

            {/* Popular Menu Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">人気の推しメニュー</h2>
                <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium">
                  ランキング
                </Button>
              </div>
              
              <div className="space-y-3">
                {popularMenus.slice(0, 4).map((menu) => (
                  <Card key={menu.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex space-x-3">
                        <img
                          src={menu.imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80"}
                          alt={menu.name}
                          className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-800 mb-1 truncate">
                            {menu.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1 truncate">
                            {menu.restaurantName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-bold text-sm">¥{menu.price}</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-accent">★</span>
                              <span className="text-xs text-gray-600">4.{Math.floor(Math.random() * 9) + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-6 flex flex-col space-y-3 z-30 md:bottom-6">
        <Button
          onClick={handleOpenReviewModal}
          className="w-12 h-12 bg-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow p-0"
          title="レビューを書く"
        >
          <Edit3 className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleShareApp}
          className="w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow p-0"
          title="アプリをシェア"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Review Modal */}
      {selectedRestaurant && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          restaurantId={selectedRestaurant.id}
          restaurantName={selectedRestaurant.name}
        />
      )}
    </div>
  );
}