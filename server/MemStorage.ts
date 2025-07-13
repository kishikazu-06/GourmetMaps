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
import { IStorage } from "./types";

export class MemStorage implements IStorage {
  private restaurants: Restaurant[] = [];
  private reviews: Review[] = [];
  private bookmarks: Bookmark[] = [];
  private menuItems: MenuItem[] = [];
  private nextId = 1;

  async getRestaurants(filters?: { genre?: string; search?: string }): Promise<RestaurantWithStats[]> {
    // This is a simplified implementation. A real implementation would handle filtering.
    return this.restaurants.map(r => ({ ...r, averageRating: 0, reviewCount: 0, isOpen: true }));
  }

  async getRestaurant(id: number): Promise<RestaurantWithDetails | undefined> {
    const restaurant = this.restaurants.find(r => r.id === id);
    if (!restaurant) return undefined;
    return { ...restaurant, reviews: [], menuItems: [], averageRating: 0, reviewCount: 0, isOpen: true };
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const newRestaurant: Restaurant = { ...restaurant, id: this.nextId++, createdAt: new Date(), hours: '', priceRange: '', features: [] };
    this.restaurants.push(newRestaurant);
    return newRestaurant;
  }

  async updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const index = this.restaurants.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    this.restaurants[index] = { ...this.restaurants[index], ...restaurant };
    return this.restaurants[index];
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    const index = this.restaurants.findIndex(r => r.id === id);
    if (index === -1) return false;
    this.restaurants.splice(index, 1);
    return true;
  }

  // Implement other methods as needed, for now they can return empty arrays or default values
  async getReviewsByRestaurant(restaurantId: number): Promise<Review[]> { return []; }
  async getReviewsByUser(userCookie: string): Promise<Review[]> { return []; }
  async createReview(review: InsertReview): Promise<Review> { 
    const newReview = { ...review, id: this.nextId++, createdAt: new Date() };
    this.reviews.push(newReview);
    return newReview;
  }
  async updateReview(id: number, review: Partial<InsertReview>, userCookie: string): Promise<Review | undefined> { return undefined; }
  async deleteReview(id: number, userCookie: string): Promise<boolean> { return false; }
  async getBookmarksByUser(userCookie: string): Promise<RestaurantWithStats[]> { return []; }
  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const newBookmark = { ...bookmark, id: this.nextId++ };
    this.bookmarks.push(newBookmark);
    return newBookmark;
  }
  async deleteBookmark(restaurantId: number, userCookie: string): Promise<boolean> { return false; }
  async isBookmarked(restaurantId: number, userCookie: string): Promise<boolean> { return false; }
  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> { return []; }
  async getPopularMenuItems(): Promise<(MenuItem & { restaurantName: string })[]> { return []; }
  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const newMenuItem = { ...menuItem, id: this.nextId++ };
    this.menuItems.push(newMenuItem);
    return newMenuItem;
  }
  async updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> { return undefined; }
  async deleteMenuItem(id: number): Promise<boolean> { return false; }
}
