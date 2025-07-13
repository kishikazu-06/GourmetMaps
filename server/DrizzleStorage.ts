import { db } from "./drizzle";
import { 
  restaurants, 
  reviews, 
  bookmarks, 
  menuItems,
  type Restaurant, 
  type InsertRestaurant,
  type Review,
  type InsertReview,
  type Bookmark,
  type InsertBookmark,
  type MenuItem,
  type InsertMenuItem,
  type RestaurantWithStats,
  type RestaurantWithDetails
} from "@shared/schema";
import { IStorage } from "./types";
import { eq, sql, and, like, inArray } from "drizzle-orm";

export class DrizzleStorage implements IStorage {
  async getRestaurants(filters?: { genre?: string; search?: string }): Promise<RestaurantWithStats[]> {
    const conditions = [];
    if (filters?.genre && filters.genre !== "all") {
      conditions.push(eq(restaurants.genre, filters.genre));
    }
    if (filters?.search) {
      conditions.push(like(restaurants.name, `%${filters.search}%`));
    }

    const allRestaurants = await db.query.restaurants.findMany({
      where: and(...conditions),
      with: {
        reviews: true,
      },
    }) as any;

    return allRestaurants.map((r: any) => {
      const reviewCount = r.reviews.length;
      const averageRating = reviewCount > 0
        ? r.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
        : 0;
      return {
        ...r,
        reviewCount,
        averageRating: Number(averageRating.toFixed(1)),
      };
    });
  }

  async getRestaurant(id: number): Promise<RestaurantWithDetails | undefined> {
    const restaurant = await db.query.restaurants.findFirst({
      where: eq(restaurants.id, id),
      with: {
        reviews: true,
        menuItems: true,
      },
    });

    if (!restaurant) return undefined;

    const reviewCount = restaurant.reviews.length;
    const averageRating = reviewCount > 0
      ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

    return {
      ...restaurant,
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount,
    };
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [newRestaurant] = await db.insert(restaurants).values(restaurant).returning();
    return newRestaurant;
  }

  async updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const [updatedRestaurant] = await db.update(restaurants).set(restaurant).where(eq(restaurants.id, id)).returning();
    return updatedRestaurant;
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    const result = await db.delete(restaurants).where(eq(restaurants.id, id)).returning({ id: restaurants.id });
    return result.length > 0;
  }

  async getReviewsByRestaurant(restaurantId: number): Promise<Review[]> {
    return db.query.reviews.findMany({
      where: eq(reviews.restaurantId, restaurantId),
    });
  }

  async getReviewsByUser(userCookie: string): Promise<Review[]> {
    return db.query.reviews.findMany({
      where: eq(reviews.userCookie, userCookie),
    });
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async updateReview(id: number, review: Partial<InsertReview>, userCookie: string): Promise<Review | undefined> {
    const [updatedReview] = await db.update(reviews).set(review).where(and(eq(reviews.id, id), eq(reviews.userCookie, userCookie))).returning();
    return updatedReview;
  }

  async deleteReview(id: number, userCookie: string): Promise<boolean> {
    const result = await db.delete(reviews).where(and(eq(reviews.id, id), eq(reviews.userCookie, userCookie))).returning({ id: reviews.id });
    return result.length > 0;
  }

  async getBookmarksByUser(userCookie: string): Promise<RestaurantWithStats[]> {
    const userBookmarks = await db.query.bookmarks.findMany({
      where: eq(bookmarks.userCookie, userCookie),
      with: { restaurant: { with: { reviews: true } } },
    }) as any;

    return userBookmarks.map((b: any) => {
      const reviewCount = b.restaurant.reviews.length;
      const averageRating = reviewCount > 0
        ? b.restaurant.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
        : 0;
      return {
        ...b.restaurant,
        reviewCount,
        averageRating: Number(averageRating.toFixed(1)),
        isBookmarked: true,
      };
    });
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const [newBookmark] = await db.insert(bookmarks).values(bookmark).returning();
    return newBookmark;
  }

  async deleteBookmark(restaurantId: number, userCookie: string): Promise<boolean> {
    const result = await db.delete(bookmarks).where(and(eq(bookmarks.restaurantId, restaurantId), eq(bookmarks.userCookie, userCookie))).returning({ id: bookmarks.id });
    return result.length > 0;
  }

  async isBookmarked(restaurantId: number, userCookie: string): Promise<boolean> {
    const bookmark = await db.query.bookmarks.findFirst({
      where: and(eq(bookmarks.restaurantId, restaurantId), eq(bookmarks.userCookie, userCookie)),
    });
    return !!bookmark;
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return db.query.menuItems.findMany({
      where: eq(menuItems.restaurantId, restaurantId),
    });
  }

  async getPopularMenuItems(): Promise<(MenuItem & { restaurantName: string })[]> {
    const popularItems = await db.query.menuItems.findMany({
      where: eq(menuItems.isPopular, true),
      with: {
        restaurant: true,
      },
    });

    return popularItems.map(item => ({
      ...item,
      restaurantName: item.restaurant.name,
    }));
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newMenuItem] = await db.insert(menuItems).values(menuItem).returning();
    return newMenuItem;
  }

  async updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db.update(menuItems).set(menuItem).where(eq(menuItems.id, id)).returning();
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id)).returning({ id: menuItems.id });
    return result.length > 0;
  }
}