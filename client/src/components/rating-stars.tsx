import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  interactive = false,
  onRatingChange,
  className 
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const renderStar = (index: number) => {
    const starRating = index + 1;
    const filled = rating >= starRating;
    const halfFilled = rating >= starRating - 0.5 && rating < starRating;

    return (
      <button
        key={index}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRatingChange?.(starRating)}
        className={cn(
          sizeClasses[size],
          "text-accent",
          interactive && "hover:scale-110 transition-transform cursor-pointer",
          !interactive && "cursor-default"
        )}
      >
        {filled ? (
          <Star className="w-full h-full fill-current" />
        ) : halfFilled ? (
          <StarHalf className="w-full h-full fill-current" />
        ) : (
          <Star className="w-full h-full" />
        )}
      </button>
    );
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
    </div>
  );
}
