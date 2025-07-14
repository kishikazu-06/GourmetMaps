import { db } from "./drizzle.js";
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
} from "../shared/schema.js";
import { IStorage } from "./types.js";
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
    }) as any[];

    return allRestaurants.map((r: any) => {
      const reviews = r.reviews as any[];
      // @ts-ignore
      const reviewCount = (reviews as any).length;
      // @ts-ignore
      const averageRating = reviewCount > 0
        ? (reviews as any).reduce((acc: any, review: any) => acc + review.rating, 0) / reviewCount
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

    const reviews = restaurant.reviews as any;
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? reviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviewCount
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
    }) as any[];

    return userBookmarks.map((b: any) => {
      const reviews = b.restaurant.reviews as any[];
      // @ts-ignore
      const reviewCount = (reviews as any).length;
      // @ts-ignore
      const averageRating = reviewCount > 0
        ? (reviews as any).reduce((acc: any, review: any) => acc + review.rating, 0) / reviewCount
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

    return popularItems.map((item: any) => ({
      ...item,
      restaurantName: item.restaurant.name,
    }));
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    // Check for existing menu item with same name for the same restaurant
    const existingMenuItem = await db.query.menuItems.findFirst({
      where: and(
        eq(menuItems.restaurantId, menuItem.restaurantId),
        eq(menuItems.name, menuItem.name)
      ),
    });

    if (existingMenuItem) {
      throw new Error("このメニューはすでに登録されています。");
    }

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

  async createRestaurantWithMenus(data: any): Promise<Restaurant> {
    return db.transaction(async (tx) => {
      const { menus, ...restaurantData } = data;

      // Check for existing restaurant with same name and address
      const existingRestaurant = await tx.query.restaurants.findFirst({
        where: and(
          eq(restaurants.name, restaurantData.name),
          eq(restaurants.address, restaurantData.address)
        ),
      });

      if (existingRestaurant) {
        throw new Error("このお店はすでに登録されています。");
      }

      const [newRestaurant] = await tx.insert(restaurants).values(restaurantData).returning();

      if (menus && menus.length > 0) {
        const menuItemsToInsert = menus.map((menu: any) => ({
          ...menu,
          restaurantId: newRestaurant.id,
        }));
        await tx.insert(menuItems).values(menuItemsToInsert);
      }

      return newRestaurant;
    });
  }
}