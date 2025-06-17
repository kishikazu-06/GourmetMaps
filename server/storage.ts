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

export interface IStorage {
  // Restaurant operations
  getRestaurants(filters?: { genre?: string; search?: string }): Promise<RestaurantWithStats[]>;
  getRestaurant(id: number): Promise<RestaurantWithDetails | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  deleteRestaurant(id: number): Promise<boolean>;

  // Review operations
  getReviewsByRestaurant(restaurantId: number): Promise<Review[]>;
  getReviewsByUser(userCookie: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>, userCookie: string): Promise<Review | undefined>;
  deleteReview(id: number, userCookie: string): Promise<boolean>;

  // Bookmark operations
  getBookmarksByUser(userCookie: string): Promise<RestaurantWithStats[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(restaurantId: number, userCookie: string): Promise<boolean>;
  isBookmarked(restaurantId: number, userCookie: string): Promise<boolean>;

  // Menu item operations
  getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]>;
  getPopularMenuItems(): Promise<(MenuItem & { restaurantName: string })[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant> = new Map();
  private reviews: Map<number, Review> = new Map();
  private bookmarks: Map<number, Bookmark> = new Map();
  private menuItems: Map<number, MenuItem> = new Map();
  private currentId: number = 1;
  private currentReviewId: number = 1;
  private currentBookmarkId: number = 1;
  private currentMenuItemId: number = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed restaurants
    const sampleRestaurants: InsertRestaurant[] = [
      {
        name: "麺屋 射水",
        genre: "ラーメン",
        address: "富山県射水市中央町1-1",
        phone: "0766-xx-xxxx",
        description: "こってり豚骨スープが自慢の老舗ラーメン店。学生に人気の大盛りサービスあり！",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7800,
        longitude: 137.0850,
        hours: "11:00-22:00",
        priceRange: "¥500-¥1000",
        features: ["学生割引", "大盛りサービス", "駐車場あり"]
      },
      {
        name: "カフェ・ド・マルシェ",
        genre: "カフェ",
        address: "富山県射水市新湊1-2-3",
        phone: "0766-xx-xxxx",
        description: "自家焙煎コーヒーと手作りスイーツが人気。勉強スペースもあり学生に優しい！",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7850,
        longitude: 137.0900,
        hours: "8:00-20:00",
        priceRange: "¥300-¥800",
        features: ["WiFi", "電源", "勉強スペース", "テイクアウト"]
      },
      {
        name: "学生居酒屋 わいわい",
        genre: "居酒屋",
        address: "富山県射水市小杉町2-3-4",
        phone: "0766-xx-xxxx",
        description: "学生証提示で10%オフ！安くて美味しい居酒屋メニューが豊富です。",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7750,
        longitude: 137.0800,
        hours: "17:00-23:00",
        priceRange: "¥1000-¥2000",
        features: ["学生割引", "団体OK", "飲み放題"]
      }
    ];

    sampleRestaurants.forEach(restaurant => {
      this.createRestaurant(restaurant);
    });

    // Seed menu items
    const sampleMenuItems: InsertMenuItem[] = [
      { restaurantId: 1, name: "こってり味玉ラーメン", price: 750, description: "自慢の豚骨スープに味玉をトッピング", isPopular: true },
      { restaurantId: 1, name: "チャーシュー麺", price: 900, description: "厚切りチャーシューがたっぷり" },
      { restaurantId: 2, name: "特製アボカドバーガー", price: 880, description: "アボカドとベーコンの絶妙な組み合わせ", isPopular: true },
      { restaurantId: 2, name: "特製抹茶パフェ", price: 650, description: "自家製抹茶アイスと和スイーツ", isPopular: true },
      { restaurantId: 3, name: "名物！鶏もも串", price: 120, description: "秘伝のタレで焼き上げた絶品串", isPopular: true },
      { restaurantId: 3, name: "学生セット", price: 1200, description: "メイン料理3品+ドリンク付き" }
    ];

    sampleMenuItems.forEach(menuItem => {
      this.createMenuItem(menuItem);
    });

    // Seed reviews
    const sampleReviews: InsertReview[] = [
      { restaurantId: 1, userCookie: "user1", nickname: "ラーメン太郎", rating: 5, comment: "スープが濃厚で美味しい！学生には嬉しい大盛りサービスも最高です。" },
      { restaurantId: 1, userCookie: "user2", nickname: "麺好き", rating: 4, comment: "こってりしてるけど最後まで飲み干せる美味しさ。" },
      { restaurantId: 2, userCookie: "user3", nickname: "カフェ好き", rating: 4, comment: "コーヒーが美味しくて勉強もしやすい。WiFiと電源があるのが助かります。" },
      { restaurantId: 3, userCookie: "user1", nickname: "ラーメン太郎", rating: 5, comment: "学生割引があって安い！料理も美味しくて満足です。" }
    ];

    sampleReviews.forEach(review => {
      this.createReview(review);
    });
  }

  async getRestaurants(filters?: { genre?: string; search?: string }): Promise<RestaurantWithStats[]> {
    let restaurantList = Array.from(this.restaurants.values());

    if (filters?.genre && filters.genre !== "all") {
      restaurantList = restaurantList.filter(r => r.genre === filters.genre);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      restaurantList = restaurantList.filter(r => 
        r.name.toLowerCase().includes(searchTerm) ||
        r.description?.toLowerCase().includes(searchTerm) ||
        r.genre.toLowerCase().includes(searchTerm)
      );
    }

    return restaurantList.map(restaurant => {
      const restaurantReviews = Array.from(this.reviews.values()).filter(r => r.restaurantId === restaurant.id);
      const reviewCount = restaurantReviews.length;
      const averageRating = reviewCount > 0 
        ? restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
        : 0;

      return {
        ...restaurant,
        averageRating: Number(averageRating.toFixed(1)),
        reviewCount
      };
    });
  }

  async getRestaurant(id: number): Promise<RestaurantWithDetails | undefined> {
    const restaurant = this.restaurants.get(id);
    if (!restaurant) return undefined;

    const restaurantReviews = Array.from(this.reviews.values()).filter(r => r.restaurantId === id);
    const reviewCount = restaurantReviews.length;
    const averageRating = reviewCount > 0 
      ? restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
      : 0;

    const restaurantMenuItems = Array.from(this.menuItems.values()).filter(m => m.restaurantId === id);

    return {
      ...restaurant,
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount,
      reviews: restaurantReviews,
      menuItems: restaurantMenuItems
    };
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentId++;
    const newRestaurant: Restaurant = {
      ...restaurant,
      id,
      createdAt: new Date()
    };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }

  async updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const existing = this.restaurants.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...restaurant };
    this.restaurants.set(id, updated);
    return updated;
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    return this.restaurants.delete(id);
  }

  async getReviewsByRestaurant(restaurantId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.restaurantId === restaurantId);
  }

  async getReviewsByUser(userCookie: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.userCookie === userCookie);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const newReview: Review = {
      ...review,
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async updateReview(id: number, review: Partial<InsertReview>, userCookie: string): Promise<Review | undefined> {
    const existing = this.reviews.get(id);
    if (!existing || existing.userCookie !== userCookie) return undefined;

    const updated = { ...existing, ...review };
    this.reviews.set(id, updated);
    return updated;
  }

  async deleteReview(id: number, userCookie: string): Promise<boolean> {
    const existing = this.reviews.get(id);
    if (!existing || existing.userCookie !== userCookie) return false;

    return this.reviews.delete(id);
  }

  async getBookmarksByUser(userCookie: string): Promise<RestaurantWithStats[]> {
    const userBookmarks = Array.from(this.bookmarks.values()).filter(b => b.userCookie === userCookie);
    const restaurantIds = userBookmarks.map(b => b.restaurantId);
    
    return (await this.getRestaurants()).filter(r => restaurantIds.includes(r.id));
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const newBookmark: Bookmark = {
      ...bookmark,
      id,
      createdAt: new Date()
    };
    this.bookmarks.set(id, newBookmark);
    return newBookmark;
  }

  async deleteBookmark(restaurantId: number, userCookie: string): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.values()).find(
      b => b.restaurantId === restaurantId && b.userCookie === userCookie
    );
    if (!bookmark) return false;

    return this.bookmarks.delete(bookmark.id);
  }

  async isBookmarked(restaurantId: number, userCookie: string): Promise<boolean> {
    return Array.from(this.bookmarks.values()).some(
      b => b.restaurantId === restaurantId && b.userCookie === userCookie
    );
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(m => m.restaurantId === restaurantId);
  }

  async getPopularMenuItems(): Promise<(MenuItem & { restaurantName: string })[]> {
    const popularItems = Array.from(this.menuItems.values()).filter(m => m.isPopular);
    
    return popularItems.map(item => {
      const restaurant = this.restaurants.get(item.restaurantId);
      return {
        ...item,
        restaurantName: restaurant?.name || "Unknown Restaurant"
      };
    });
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const newMenuItem: MenuItem = {
      ...menuItem,
      id
    };
    this.menuItems.set(id, newMenuItem);
    return newMenuItem;
  }

  async updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existing = this.menuItems.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...menuItem };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }
}

export const storage = new MemStorage();
