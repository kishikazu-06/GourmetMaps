import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search-bar";
import { RestaurantCard } from "@/components/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RestaurantWithStats } from "@shared/schema";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");

  const { data: restaurants = [], isLoading } = useQuery<RestaurantWithStats[]>({
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (genre: string) => {
    setCurrentFilter(genre);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">お店を探す</h1>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        currentFilter={currentFilter}
        onToggleMap={() => {}}
        onGetLocation={() => {}}
      />

      {/* Results */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            検索結果 ({restaurants.length}件)
          </h2>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="distance">距離順</option>
            <option value="rating">評価順</option>
            <option value="popular">人気順</option>
            <option value="newest">新着順</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex space-x-4">
                  <Skeleton className="w-24 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">お店が見つかりませんでした</div>
            <p className="text-gray-400">検索条件を変更してお試しください</p>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                variant="list"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
