import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Clock, Phone } from "lucide-react";
import { RatingStars } from "./rating-stars";
import { useUserCookie } from "@/hooks/use-user-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { RestaurantWithStats } from "@shared/schema";

interface RestaurantCardProps {
  restaurant: RestaurantWithStats;
  variant?: "featured" | "list";
  onToggleBookmark?: (restaurantId: number, isBookmarked: boolean) => void;
}

export function RestaurantCard({ restaurant, variant = "featured", onToggleBookmark }: RestaurantCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(restaurant.isBookmarked || false);
  const userCookie = useUserCookie();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async ({ restaurantId, shouldBookmark }: { restaurantId: number; shouldBookmark: boolean }) => {
      if (shouldBookmark) {
        return apiRequest("POST", "/api/bookmarks", { restaurantId }, userCookie);
      } else {
        return apiRequest("DELETE", `/api/bookmarks/${restaurantId}`, undefined, userCookie);
      }
    },
    onSuccess: (_, { restaurantId, shouldBookmark }) => {
      setIsBookmarked(shouldBookmark);
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      onToggleBookmark?.(restaurantId, shouldBookmark);
      toast({
        title: shouldBookmark ? "ブックマークに追加しました" : "ブックマークを削除しました",
        description: restaurant.name,
      });
    },
    onError: () => {
      toast({
        title: "エラーが発生しました",
        description: "しばらく経ってから再度お試しください",
        variant: "destructive",
      });
    },
  });

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userCookie) return;
    
    bookmarkMutation.mutate({
      restaurantId: restaurant.id,
      shouldBookmark: !isBookmarked
    });
  };

  const getStatusInfo = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Simple logic - in a real app this would check actual hours
    if (currentHour >= 22 || currentHour < 8) {
      return { status: "閉店", className: "bg-danger/10 text-danger" };
    } else if (currentHour >= 17) {
      return { status: "営業中", className: "bg-success/10 text-success" };
    } else {
      return { status: "17:00開店", className: "bg-warning/10 text-warning" };
    }
  };

  const statusInfo = getStatusInfo();

  if (variant === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <img
              src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"}
              alt={restaurant.name}
              className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg text-gray-800 truncate">{restaurant.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkMutation.isPending}
                  className="text-gray-400 hover:text-red-500 ml-2 p-1"
                >
                  <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center space-x-1">
                  <RatingStars rating={restaurant.averageRating} size="sm" />
                  <span className="text-sm text-gray-600">
                    {restaurant.averageRating} ({restaurant.reviewCount}件)
                  </span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {restaurant.genre}
                </Badge>
                <div className="flex items-center space-x-1 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">徒歩{Math.floor(Math.random() * 10) + 1}分</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {restaurant.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.hours || "11:00-22:00"}</span>
                  </div>
                  {restaurant.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={statusInfo.className}>
                    {statusInfo.status}
                  </Badge>
                  <Link href={`/restaurant/${restaurant.id}`}>
                    <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                      詳細
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={restaurant.imageUrl || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmarkToggle}
          disabled={bookmarkMutation.isPending}
          className="absolute top-2 right-2 text-white hover:text-red-500 bg-black/20 hover:bg-black/40 backdrop-blur-sm"
        >
          <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800">{restaurant.name}</h3>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <RatingStars rating={restaurant.averageRating} size="sm" />
          <span className="text-sm text-gray-600">
            {restaurant.averageRating} ({restaurant.reviewCount}件)
          </span>
        </div>
        <Badge variant="secondary" className="mb-2">
          {restaurant.genre}
        </Badge>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {restaurant.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>徒歩{Math.floor(Math.random() * 10) + 1}分</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={statusInfo.className}>
              {statusInfo.status}
            </Badge>
            <Link href={`/restaurant/${restaurant.id}`}>
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                詳細
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
