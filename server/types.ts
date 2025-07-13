import { 
  Restaurant, 
  InsertRestaurant,
  Review,
  InsertReview,
  Bookmark,
  InsertBookmark,
  MenuItem,
  InsertMenuItem,
  RestaurantWithStats,
  RestaurantWithDetails
} from "@shared/schema";

export interface IStorage {
  getRestaurants(filters?: { genre?: string; search?: string }): Promise<RestaurantWithStats[]>;
  getRestaurant(id: number): Promise<RestaurantWithDetails | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  deleteRestaurant(id: number): Promise<boolean>;
  getReviewsByRestaurant(restaurantId: number): Promise<Review[]>;
  getReviewsByUser(userCookie: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>, userCookie: string): Promise<Review | undefined>;
  deleteReview(id: number, userCookie: string): Promise<boolean>;
  getBookmarksByUser(userCookie: string): Promise<RestaurantWithStats[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(restaurantId: number, userCookie: string): Promise<boolean>;
  isBookmarked(restaurantId: number, userCookie: string): Promise<boolean>;
  getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]>;
  getPopularMenuItems(): Promise<(MenuItem & { restaurantName: string })[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
}
