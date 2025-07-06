import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { RestaurantCard } from "@/components/restaurant-card";
import { useUserCookie } from "@/hooks/use-user-cookie";
import type { RestaurantWithStats } from "@shared/schema";

export default function Favorites() {
  const userCookie = useUserCookie();

  const { data: bookmarks = [], isLoading } = useQuery<RestaurantWithStats[]>({
    queryKey: ["/api/bookmarks"],
    queryFn: async () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-bold text-gray-800">お気に入り</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <Skeleton className="w-24 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              お気に入りはまだありません
            </h2>
            <p className="text-gray-600">
              気になるお店をハートマークでお気に入りに追加しましょう
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                お気に入りのお店 ({bookmarks.length}件)
              </h2>
            </div>
            <div className="space-y-4">
              {bookmarks.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={{ ...restaurant, isBookmarked: true }}
                  variant="list"
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
