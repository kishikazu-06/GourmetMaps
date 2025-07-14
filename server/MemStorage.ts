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
import { IStorage } from "./types.js";

export class MemStorage implements IStorage {
  private restaurants: Restaurant[] = [];
  private reviews: Review[] = [];
  private bookmarks: Bookmark[] = [];
  private menuItems: MenuItem[] = [];
  private nextId = 1;

  private nextRestaurantId = 1;
  private nextReviewId = 1;
  private nextBookmarkId = 1;
  private nextMenuItemId = 1;

  async getRestaurants(filters?: { genre?: string; search?: string }): Promise<RestaurantWithStats[]> {
    return this.restaurants.map(r => this.toRestaurantWithStats(r));
  }

  async getRestaurant(id: number): Promise<RestaurantWithDetails | undefined> {
    const restaurant = this.restaurants.find(r => r.id === id);
    if (!restaurant) return undefined;
    const reviews = this.reviews.filter(r => r.restaurantId === id);
    const menuItems = this.menuItems.filter(m => m.restaurantId === id);
    const stats = this.getStats(reviews);
    return { ...restaurant, ...stats, reviews, menuItems };
  }

  async createRestaurant(data: InsertRestaurant): Promise<Restaurant> {
    const newRestaurant: Restaurant = {
      id: this.nextRestaurantId++,
      createdAt: new Date(),
      phone: null,
      description: null,
      imageUrl: null,
      latitude: null,
      longitude: null,
      hours: null,
      priceRange: null,
      features: null,
      isOpen: true,
      ...data,
    };
    this.restaurants.push(newRestaurant);
    return newRestaurant;
  }

  async updateRestaurant(id: number, data: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const index = this.restaurants.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    this.restaurants[index] = { ...this.restaurants[index], ...data };
    return this.restaurants[index];
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    const index = this.restaurants.findIndex(r => r.id === id);
    if (index === -1) return false;
    this.restaurants.splice(index, 1);
    return true;
  }

  async getReviewsByRestaurant(restaurantId: number): Promise<Review[]> {
    return this.reviews.filter(r => r.restaurantId === restaurantId);
  }

  async getReviewsByUser(userCookie: string): Promise<Review[]> {
    return this.reviews.filter(r => r.userCookie === userCookie);
  }

  async createReview(data: InsertReview): Promise<Review> {
    const newReview: Review = {
      id: this.nextReviewId++,
      createdAt: new Date(),
      comment: null,
      ...data,
    };
    this.reviews.push(newReview);
    return newReview;
  }

  async updateReview(id: number, data: Partial<InsertReview>, userCookie: string): Promise<Review | undefined> {
    const index = this.reviews.findIndex(r => r.id === id && r.userCookie === userCookie);
    if (index === -1) return undefined;
    this.reviews[index] = { ...this.reviews[index], ...data };
    return this.reviews[index];
  }

  async deleteReview(id: number, userCookie: string): Promise<boolean> {
    const index = this.reviews.findIndex(r => r.id === id && r.userCookie === userCookie);
    if (index === -1) return false;
    this.reviews.splice(index, 1);
    return true;
  }

  async getBookmarksByUser(userCookie: string): Promise<RestaurantWithStats[]> {
    const userBookmarks = this.bookmarks.filter(b => b.userCookie === userCookie);
    return userBookmarks
      .map(b => this.restaurants.find(r => r.id === b.restaurantId))
      .filter((r): r is Restaurant => !!r)
      .map(r => ({ ...this.toRestaurantWithStats(r), isBookmarked: true }));
  }

  async createBookmark(data: InsertBookmark): Promise<Bookmark> {
    const newBookmark: Bookmark = {
      id: this.nextBookmarkId++,
      createdAt: new Date(),
      ...data,
    };
    this.bookmarks.push(newBookmark);
    return newBookmark;
  }

  async deleteBookmark(restaurantId: number, userCookie: string): Promise<boolean> {
    const index = this.bookmarks.findIndex(b => b.restaurantId === restaurantId && b.userCookie === userCookie);
    if (index === -1) return false;
    this.bookmarks.splice(index, 1);
    return true;
  }

  async isBookmarked(restaurantId: number, userCookie: string): Promise<boolean> {
    return this.bookmarks.some(b => b.restaurantId === restaurantId && b.userCookie === userCookie);
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return this.menuItems.filter(m => m.restaurantId === restaurantId);
  }

  async getPopularMenuItems(): Promise<(MenuItem & { restaurantName: string; })[]> {
    return this.menuItems
      .filter(m => m.isPopular)
      .map(m => {
        const restaurant = this.restaurants.find(r => r.id === m.restaurantId);
        return { ...m, restaurantName: restaurant?.name || 'Unknown' };
      });
  }

  async createMenuItem(data: InsertMenuItem): Promise<MenuItem> {
    const newMenuItem: MenuItem = {
      id: this.nextMenuItemId++,
      description: null,
      imageUrl: null,
      isPopular: false,
      ...data,
    };
    this.menuItems.push(newMenuItem);
    return newMenuItem;
  }

  async updateMenuItem(id: number, data: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const index = this.menuItems.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    this.menuItems[index] = { ...this.menuItems[index], ...data };
    return this.menuItems[index];
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const index = this.menuItems.findIndex(m => m.id === id);
    if (index === -1) return false;
    this.menuItems.splice(index, 1);
    return true;
  }

  private getStats(reviews: Review[]) {
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
    return { reviewCount, averageRating: Number(averageRating.toFixed(1)) };
  }

  private toRestaurantWithStats(restaurant: Restaurant): RestaurantWithStats {
    const reviews = this.reviews.filter(r => r.restaurantId === restaurant.id);
    const stats = this.getStats(reviews);
    return { ...restaurant, ...stats };
  }
}