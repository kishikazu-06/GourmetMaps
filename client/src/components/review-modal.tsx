import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RatingStars } from "./rating-stars";
import { useUserCookie } from "@/hooks/use-user-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const reviewSchema = z.object({
  restaurantId: z.number(),
  nickname: z.string().min(1, "ニックネームを入力してください"),
  rating: z.number().min(1, "評価を選択してください").max(5),
  comment: z.string().min(1, "コメントを入力してください"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: number;
  restaurantName: string;
  existingReview?: {
    id: number;
    nickname: string;
    rating: number;
    comment: string;
  };
}

export function ReviewModal({ 
  isOpen, 
  onClose, 
  restaurantId, 
  restaurantName,
  existingReview 
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const userCookie = useUserCookie();
  const { toast } = useToast();
  const queryClient = useQueryClient();



  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      restaurantId,
      nickname: existingReview?.nickname || "",
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || "",
    }
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      if (!userCookie) {
        throw new Error("ユーザークッキーが見つかりません");
      }
      
      if (existingReview) {
        return apiRequest("PUT", `/api/reviews/${existingReview.id}`, data, userCookie);
      } else {
        return apiRequest("POST", "/api/reviews", data, userCookie);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/user"] });
      
      toast({
        title: existingReview ? "レビューを更新しました" : "レビューを投稿しました",
        description: restaurantName,
      });
      
      reset();
      setRating(0);
      onClose();
    },
    onError: () => {
      toast({
        title: "エラーが発生しました",
        description: "しばらく経ってから再度お試しください",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    if (!userCookie) {
      toast({
        title: "エラー",
        description: "ユーザー情報を取得できませんでした",
        variant: "destructive",
      });
      return;
    }

    const reviewData = {
      ...data,
      rating,
    };
    
    submitReviewMutation.mutate(reviewData);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setValue("rating", newRating);
  };

  const handleClose = () => {
    reset();
    setRating(existingReview?.rating || 0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "レビューを編集" : "レビューを書く"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {restaurantName}の評価
            </Label>
            <RatingStars
              rating={rating}
              size="lg"
              interactive
              onRatingChange={handleRatingChange}
            />
            {errors.rating && (
              <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="nickname" className="text-sm font-medium text-gray-700 mb-2 block">
              ニックネーム
            </Label>
            <Input
              id="nickname"
              {...register("nickname")}
              placeholder="匿名太郎"
              className="w-full"
            />
            {errors.nickname && (
              <p className="text-sm text-red-600 mt-1">{errors.nickname.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-2 block">
              コメント
            </Label>
            <Textarea
              id="comment"
              {...register("comment")}
              rows={4}
              placeholder="お店の感想を教えてください..."
              className="w-full resize-none"
            />
            {errors.comment && (
              <p className="text-sm text-red-600 mt-1">{errors.comment.message}</p>
            )}
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button 
              type="submit" 
              disabled={submitReviewMutation.isPending || !userCookie}
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              {submitReviewMutation.isPending ? "投稿中..." : existingReview ? "更新する" : "投稿する"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
