import express from 'express';
import { Express, Request, Response } from "express";
import { storage } from "../server/storage.js";
console.log("Storage imported.");
import { insertReviewSchema, insertBookmarkSchema } from "../shared/schema.js";

console.log("API serverless function initialized.");

const app = express();

app.use(express.json());

// Restaurant routes
app.get("/api/restaurants", async (req: any, res: any) => {
  try {
    const { genre, search } = req.query;
    const restaurants = await storage.getRestaurants({
      genre: genre as string,
      search: search as string
    });
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

app.get("/api/restaurants/:id", async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const restaurant = await storage.getRestaurant(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
});

// Review routes
app.post("/api/reviews", async (req: any, res: any) => {
  try {
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(400).json({ error: "User cookie required" });
    }

    const reviewData = insertReviewSchema.parse({
      ...req.body,
      userCookie
    });

    const review = await storage.createReview(reviewData);
    res.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({ error: "Invalid review data" });
  }
});

app.get("/api/reviews/user", async (req: any, res: any) => {
  try {
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(400).json({ error: "User cookie required" });
    }

    const reviews = await storage.getReviewsByUser(userCookie);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
});

app.put("/api/reviews/:id", async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(400).json({ error: "User cookie required" });
    }

    const review = await storage.updateReview(id, req.body, userCookie);
    if (!review) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }
    res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(400).json({ error: "Failed to update review" });
  }
});

app.delete("/api/reviews/:id", async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(400).json({ error: "User cookie required" });
    }

    const success = await storage.deleteReview(id, userCookie);
    if (!success) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// Bookmark routes
app.get("/api/bookmarks", async (req: any, res: any) => {
  try {
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(400).json({ error: "User cookie required" });
    }

    const bookmarks = await storage.getBookmarksByUser(userCookie);
    res.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

app.post("/api/bookmarks", async (req: any, res: any) => {
  try {
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(400).json({ error: "User cookie required" });
    }

    const bookmarkData = insertBookmarkSchema.parse({
      ...req.body,
      userCookie
    });

    const bookmark = await storage.createBookmark(bookmarkData);
    res.json(bookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(400).json({ error: "Invalid bookmark data" });
  }
});

app.delete("/api/bookmarks/:restaurantId", async (req: any, res: any) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(400).json({ error: "User cookie required" });
    }

    const success = await storage.deleteBookmark(restaurantId, userCookie);
    res.json({ success });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
});

app.get("/api/bookmarks/:restaurantId/check", async (req: any, res: any) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(400).json({ error: "User cookie required" });
    }

    const isBookmarked = await storage.isBookmarked(restaurantId, userCookie);
    res.json({ isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    res.status(500).json({ error: "Failed to check bookmark status" });
  }
});

// Menu item routes
app.get("/api/menu-items/popular", async (req: any, res: any) => {
  try {
    const popularItems = await storage.getPopularMenuItems();
    res.json(popularItems);
  } catch (error) {
    console.error("Error fetching popular menu items:", error);
    res.status(500).json({ error: "Failed to fetch popular menu items" });
  }
});

app.get("/api/restaurants/:id/menu-items", async (req: any, res: any) => {
  try {
    const restaurantId = parseInt(req.params.id);
    const menuItems = await storage.getMenuItemsByRestaurant(restaurantId);
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by restaurant:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

app.post("/api/restaurants/:id/menu-items", async (req: any, res: any) => {
  try {
    const restaurantId = parseInt(req.params.id);
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const menuItemData = { ...req.body, restaurantId };
    const newMenuItem = await storage.createMenuItem(menuItemData);
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(400).json({ error: "Invalid menu item data" });
  }
});

app.post("/api/restaurants", async (req: any, res: any) => {
  try {
    const userCookie = req.headers['x-user-cookie'] as string;
    if (!userCookie) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = req.body;
    const newRestaurant = await storage.createRestaurantWithMenus(data);
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(400).json({ error: "Invalid restaurant data" });
  }
});

export default app;
