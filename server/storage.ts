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
<<<<<<< HEAD
        name: "MESO",
        genre: "カフェ",
        address: "射水市戸破1730-4",
        phone: "0766-55-5524",
        description: "キーマカレードリアセットが有名",
        imageUrl: "https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.723216,
        longitude: 137.099571,
        hours: "11～14時  17～22時",
        priceRange: "1000円～2000円",
        features: ["キーマカレードリアセット"]
      },
      {
        name: "ラーメン豚鶏歓",
        genre: "ラーメン",
        address: "射水市戸破1730-4",
        phone: "0766-56-7702",
        description: "豚鶏歓ラーメンが有名",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.732958,
        longitude: 137.098083,
        hours: "",
        priceRange: "",
        features: ["豚鶏歓ラーメン"]
      },
      {
        name: "中華そば専門いちい",
        genre: "ラーメン",
        address: "射水市三ケ802",
        phone: "0766-55-3333",
        description: "中華そばが有名",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.722298,
        longitude: 137.098983,
        hours: "10～19時(ラストオーダー18時40分)",
        priceRange: "1000円～2000円",
        features: ["中華そば"]
      },
      {
        name: "とべーぐる•宿カリチーズケーキ小杉店",
        genre: "焼きたてベーグル専門店",
        address: "射水市戸破1754-1",
        phone: "0766-54-0764",
        description: "ベリーチーズが有名",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.71642,
        longitude: 137.09605,
        hours: "11時～18時",
        priceRange: "200～1000円",
        features: ["富山のスイートポテト"]
      },
      {
        name: "不二家",
        genre: "食堂　かつ丼　そば",
        address: "射水市三ケ伊勢領２２８２−２",
        phone: "0766-56-2557",
        description: "かつ丼、親子丼が有名",
        imageUrl: "https://images.unsplash.com/photo-1564759297669-220e4a2a6934?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.72048,
        longitude: 137.08834,
        hours: "11時～15時",
        priceRange: "1～1000円",
        features: ["かつ丼", "親子丼", "不二家丼"]
      },
      {
        name: "李白",
        genre: "中華",
        address: "射水市小島１６４−１",
        phone: "0766-52-1774",
        description: "マーボーご飯が有名",
        imageUrl: "https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.73738,
        longitude: 137.05853,
        hours: "11時半～14時半   17時半～20時半",
        priceRange: "1000～2000円",
        features: ["マーボーご飯", "五目焼きそば"]
      },
      {
        name: "はつ花",
        genre: "うどん",
        address: "射水市三ケ２６０２ アルプラ",
        phone: "0766-57-8286",
        description: "もつ煮込みうどんが有名",
        imageUrl: "https://images.unsplash.com/photo-1618585166530-574b559272a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7206,
        longitude: 137.0926,
        hours: "11時～14時半",
        priceRange: "1000～2000円",
        features: ["もつ煮込みうどん"]
=======
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
      },
      {
        name: "パン工房 麦の香り",
        genre: "ベーカリー",
        address: "富山県射水市太閤山1-5-12",
        phone: "0766-xx-xxxx",
        description: "朝6時から焼きたてパンを提供。学生向けのお得なモーニングセットが人気！",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7720,
        longitude: 137.0770,
        hours: "6:00-19:00",
        priceRange: "¥200-¥600",
        features: ["モーニングセット", "学生割引", "テイクアウト", "駐車場あり"]
      },
      {
        name: "中華料理 味香園",
        genre: "中華",
        address: "富山県射水市黒河1-8-20",
        phone: "0766-xx-xxxx",
        description: "本格中華を学生価格で！ボリューム満点の定食メニューが自慢です。",
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7680,
        longitude: 137.0920,
        hours: "11:30-14:30, 17:00-21:00",
        priceRange: "¥600-¥1200",
        features: ["学生割引", "大盛り無料", "団体OK", "駐車場あり"]
      },
      {
        name: "スイーツカフェ Sweets Dream",
        genre: "スイーツ",
        address: "富山県射水市中新湊3-2-15",
        phone: "0766-xx-xxxx",
        description: "手作りケーキとパフェが自慢のスイーツ専門店。インスタ映え間違いなし！",
        imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7820,
        longitude: 137.0880,
        hours: "10:00-20:00",
        priceRange: "¥400-¥1000",
        features: ["WiFi", "インスタ映え", "テイクアウト", "誕生日ケーキ"]
      },
      {
        name: "焼肉 牛角 射水店",
        genre: "焼肉",
        address: "富山県射水市戸破2-10-5",
        phone: "0766-xx-xxxx",
        description: "学生に大人気の焼肉チェーン店。食べ放題コースがお得！",
        imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7650,
        longitude: 137.0950,
        hours: "17:00-24:00",
        priceRange: "¥1500-¥3000",
        features: ["食べ放題", "学生割引", "駐車場完備", "団体予約OK"]
      },
      {
        name: "つけ麺 道楽",
        genre: "ラーメン",
        address: "富山県射水市下条2-7-3",
        phone: "0766-xx-xxxx",
        description: "濃厚魚介つけ麺が名物。麺の太さと量を選べるのが学生に嬉しい！",
        imageUrl: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        latitude: 36.7590,
        longitude: 137.0810,
        hours: "11:00-15:00, 18:00-22:00",
        priceRange: "¥700-¥1100",
        features: ["大盛り無料", "麺量調整可", "学生割引", "深夜営業"]
>>>>>>> fafbc31439116b1921d1b2c3cbd6f8f5ee155188
      }
    ];

    sampleRestaurants.forEach(restaurant => {
      this.createRestaurant(restaurant);
    });

    // Seed menu items
    const sampleMenuItems: InsertMenuItem[] = [
<<<<<<< HEAD
  {
    "restaurantId": 1,
    "name": "半熟卵のキーマカレードリアセット",
    "price": 1780,
    "description": "7種類のスパイス×ホワイトソースとチーズ、仕上げに半熟卵付きの看板ドリアセット",
    "isPopular": true
  },
  {
    "restaurantId": 1,
    "name": "ナスとベーコンのドリアセット",
    "price": 1860,
    "description": "揚げナス＆ベーコン入りトマト＋ホワイトソースのドリアセット",
    "isPopular": false
  },
  {
    "restaurantId": 1,
    "name": "オムライスセット",
    "price": 1780,
    "description": "トマトソース or デミグラスソースのオムライスセット",
    "isPopular": false
  },
  {
    "restaurantId": 2,
    "name": "ブラックラーメン",
    "price": 1000,
    "description": "真っ黒スープだが飲みやすい、店イチオシの醤油ラーメン",
    "isPopular": true
  },
  {
    "restaurantId": 2,
    "name": "担々麺（チーズ担々・トマトチーズ担々）",
    "price": 1000,
    "description": "限定メニュー。チーズ入り、またトマトチーズ版もあり",
    "isPopular": false
  },
  {
    "restaurantId": 3,
    "name": "チャーシューメン",
    "price": 1000,
    "description": "昔ながらの鶏ガラ豚骨醤油スープ＋厚切りチャーシュー5～6枚",
    "isPopular": true
  },
  {
    "restaurantId": 3,
    "name": "中華そば",
    "price": 800,
    "description": "オーソドックス醤油ラーメン。定番の中華そば",
    "isPopular": false
  },
  {
    "restaurantId": 3,
    "name": "餃子",
    "price": 400,
    "description": "やや大振り＆食べ応えのある餃子",
    "isPopular": false
  },
  {
    "restaurantId": 3,
    "name": "ソフトクリーム",
    "price": 300,
    "description": "〆に頼む常連多数。濃厚・まったり昔ながらの味",
    "isPopular": true
  },
  {
    "restaurantId": 4,
    "name": "ベリーチーズケーキ（定番）",
    "price": 480,
    "description": "宿カリ定番、焼きたてふわっ! とろっ! な濃厚チーズケーキ",
    "isPopular": true
  },
  {
    "restaurantId": 4,
    "name": "期間限定チーズケーキ（例：桃パッション）",
    "price": 520,
    "description": "季節ごとに変わる期間限定フレーバー（例：2025年6月は桃パッション）",
    "isPopular": false
  },
  {
    "restaurantId": 4,
    "name": "チーズケーキ6個セット",
    "price": 2800,
    "description": "お得な詰め合わせセット",
    "isPopular": false
  },
  {
    "restaurantId": 5,
    "name": "かつ丼",
    "price": 650,
    "description": "学生にも人気、不二屋の不動の看板メニュー",
    "isPopular": true
  },
  {
    "restaurantId": 5,
    "name": "親子丼",
    "price": 600,
    "description": "ふわふわ玉子でじっくり煮込んだ定番丼",
    "isPopular": false
  },
  {
    "restaurantId": 5,
    "name": "不二屋丼",
    "price": 850,
    "description": "海老とホタテのかき揚げがのったボリューミーな丼",
    "isPopular": false
  },
  {
    "restaurantId": 5,
    "name": "唐揚げ定食",
    "price": 850,
    "description": "ジューシーな唐揚げ定食、ミニうどん付きもあり",
    "isPopular": false
  },
  {
    "restaurantId": 6,
    "name": "マーボーご飯",
    "price": 780,
    "description": "山椒が効いた麻婆豆腐がご飯にたっぷりかかった看板メニュー",
    "isPopular": true
  },
  {
    "restaurantId": 6,
    "name": "五目あんかけご飯",
    "price": 900,
    "description": "具材たっぷり、とろみのあるあんかけごはん（スープ付き）",
    "isPopular": true
  },
  {
    "restaurantId": 6,
    "name": "五目焼きそば",
    "price": 950,
    "description": "中太麺に八宝菜風の餡が乗ったボリューム満点メニュー",
    "isPopular": false
  },
  {
    "restaurantId": 6,
    "name": "チャーシューメン",
    "price": 820,
    "description": "中華そばに厚切りチャーシューがのった一杯",
    "isPopular": false
  },
  {
    "restaurantId": 6,
    "name": "エビチャーハン",
    "price": 720,
    "description": "大きめのエビが入ったチャーハン",
    "isPopular": false
  },
  {
    "restaurantId": 7,
    "name": "もつ煮込みうどん",
    "price": 1000,
    "description": "特製味噌スープ＆プリプリの豚ホルモンを使用した名物うどん",
    "isPopular": true
  },
  {
    "restaurantId": 7,
    "name": "トッピングたまご",
    "price": 80,
    "description": "オプションの煮込みうどんトッピング",
    "isPopular": false
  },
  {
    "restaurantId": 7,
    "name": "ライス小",
    "price": 150,
    "description": "うどんとセットで頼みたいミニライス",
    "isPopular": false
  }
];
=======
      { restaurantId: 1, name: "こってり味玉ラーメン", price: 750, description: "自慢の豚骨スープに味玉をトッピング", isPopular: true },
      { restaurantId: 1, name: "チャーシュー麺", price: 900, description: "厚切りチャーシューがたっぷり" },
      { restaurantId: 2, name: "特製アボカドバーガー", price: 880, description: "アボカドとベーコンの絶妙な組み合わせ", isPopular: true },
      { restaurantId: 2, name: "特製抹茶パフェ", price: 650, description: "自家製抹茶アイスと和スイーツ", isPopular: true },
      { restaurantId: 3, name: "名物！鶏もも串", price: 120, description: "秘伝のタレで焼き上げた絶品串", isPopular: true },
      { restaurantId: 3, name: "学生セット", price: 1200, description: "メイン料理3品+ドリンク付き" }
    ];
>>>>>>> fafbc31439116b1921d1b2c3cbd6f8f5ee155188

    sampleMenuItems.forEach(menuItem => {
      this.createMenuItem(menuItem);
    });

    // Seed reviews
    const sampleReviews: InsertReview[] = [
<<<<<<< HEAD
      { restaurantId: 1, userCookie: "user1", nickname: "ラーメン太郎", rating: 5, comment: "スープが濃厚で美味しい！学生には嬉しい大盛りサービスも最高です。"},
      { restaurantId: 1, userCookie: "user2", nickname: "麺好き", rating: 4, comment: "こってりしてるけど最後まで飲み干せる美味しさ。"},
      { restaurantId: 2, userCookie: "user3", nickname: "カフェ好き", rating: 4, comment: "コーヒーが美味しくて勉強もしやすい。WiFiと電源があるのが助かります。"},
      { restaurantId: 3, userCookie: "user1", nickname: "ラーメン太郎", rating: 5, comment: "学生割引があって安い！料理も美味しくて満足です。"}
=======
      { restaurantId: 1, userCookie: "user1", nickname: "ラーメン太郎", rating: 5, comment: "スープが濃厚で美味しい！学生には嬉しい大盛りサービスも最高です。" },
      { restaurantId: 1, userCookie: "user2", nickname: "麺好き", rating: 4, comment: "こってりしてるけど最後まで飲み干せる美味しさ。" },
      { restaurantId: 2, userCookie: "user3", nickname: "カフェ好き", rating: 4, comment: "コーヒーが美味しくて勉強もしやすい。WiFiと電源があるのが助かります。" },
      { restaurantId: 3, userCookie: "user1", nickname: "ラーメン太郎", rating: 5, comment: "学生割引があって安い！料理も美味しくて満足です。" }
>>>>>>> fafbc31439116b1921d1b2c3cbd6f8f5ee155188
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
