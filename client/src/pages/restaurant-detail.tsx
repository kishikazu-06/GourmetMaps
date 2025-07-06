import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MapPin, 
  Clock, 
  Phone, 
  Share2, 
  ArrowLeft,
  Edit3,
  Trash2
} from "lucide-react";
import { RatingStars } from "@/components/rating-stars";
import { ReviewModal } from "@/components/review-modal";
import { useUserCookie } from "@/hooks/use-user-cookie";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { RestaurantWithDetails, Review } from "@shared/schema";

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = parseInt(id || "0");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const userCookie = useUserCookie();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading } = useQuery<RestaurantWithDetails>({
    queryKey: ["/api/restaurants", restaurantId],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error("Failed to fetch restaurant");
      return response.json();
    },
    enabled: !!restaurantId,
  });

  // ブックマーク状態を確認
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!userCookie || !restaurantId) return;
      
      try {
        const response = await fetch(`/api/bookmarks/${restaurantId}/check`, {
          headers: {
            "X-User-Cookie": userCookie,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error("Failed to check bookmark status:", error);
      }
    };

    checkBookmarkStatus();
  }, [userCookie, restaurantId]);

  const { data: userReviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews/user"],
    queryFn: async () => {
      const response = await fetch("/api/reviews/user", {
        headers: {
          "X-User-Cookie": userCookie,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user reviews");
      return response.json();
    },
    enabled: !!userCookie,
  });

  const bookmarkMutation = useMutation({
    mutationFn: async ({ shouldBookmark }: { shouldBookmark: boolean }) => {
      if (shouldBookmark) {
        return apiRequest("POST", "/api/bookmarks", { restaurantId }, userCookie);
      } else {
        return apiRequest("DELETE", `/api/bookmarks/${restaurantId}`, undefined, userCookie);
      }
    },
    onSuccess: (_, { shouldBookmark }) => {
      setIsBookmarked(shouldBookmark);
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: shouldBookmark ? "ブックマークに追加しました" : "ブックマークを削除しました",
        description: restaurant?.name,
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest("DELETE", `/api/reviews/${reviewId}`, undefined, userCookie);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/user"] });
      toast({
        title: "レビューを削除しました",
      });
    },
  });

  const userReview = userReviews.find(review => review.restaurantId === restaurantId);

  const handleBookmarkToggle = () => {
    if (!userCookie) return;
    bookmarkMutation.mutate({ shouldBookmark: !isBookmarked });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant?.name || "",
          text: restaurant?.description ?? "",
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

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = (reviewId: number) => {
    if (confirm("レビューを削除しますか？")) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="w-full h-64 rounded-xl mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">お店が見つかりませんでした</h1>
          <p className="text-gray-600 mb-4">指定されたお店は存在しません</p>
          <Link href="/">
            <Button>ホームに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="font-bold text-lg text-gray-800 truncate">{restaurant.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmarkToggle}
                disabled={bookmarkMutation.isPending}
                className="text-gray-600 hover:text-red-500"
              >
                <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-600 hover:text-primary"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Restaurant Image */}
        <div className="relative mb-6">
          <img
            src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"}
            alt={restaurant.name}
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>

        {/* Restaurant Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
                <div className="flex items-center space-x-2 mb-2">
                  <RatingStars rating={restaurant.averageRating} />
                  <span className="text-sm text-gray-600">
                    {restaurant.averageRating} ({restaurant.reviewCount}件)
                  </span>
                </div>
                <Badge variant="secondary" className="mb-2">
                  {restaurant.genre}
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{restaurant.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{restaurant.address}</span>
              </div>
              {restaurant.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{restaurant.hours || "営業時間未設定"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">価格帯:</span>
                <span>{restaurant.priceRange || "未設定"}</span>
              </div>
            </div>

            {restaurant.features && restaurant.features.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">特徴</h3>
                <div className="flex flex-wrap gap-2">
                  {restaurant.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Items */}
        {restaurant.menuItems && restaurant.menuItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>メニュー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.menuItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">¥{item.price}</span>
                        {item.isPopular && (
                          <Badge variant="secondary" className="text-xs">人気</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>レビュー ({restaurant.reviewCount}件)</CardTitle>
              <Button
                onClick={() => setShowReviewModal(true)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {userReview ? "レビューを編集" : "レビューを書く"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {restaurant.reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                まだレビューがありません
              </div>
            ) : (
              <div className="space-y-4">
                {restaurant.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">{review.nickname}</span>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      {review.userCookie === userCookie && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditReview(review)}
                            className="text-gray-600 hover:text-primary p-1"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={deleteReviewMutation.isPending}
                            className="text-gray-600 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.createdAt!).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setEditingReview(null);
        }}
        restaurantId={restaurantId}
        restaurantName={restaurant.name}
        existingReview={editingReview ? {
          id: editingReview.id,
          nickname: editingReview.nickname,
          rating: editingReview.rating,
          comment: editingReview.comment || "",
        } : undefined}
      />
    </div>
  );
}
