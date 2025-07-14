import { db } from "./drizzle.js";
import { restaurants } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  await db.insert(restaurants).values([
    {
      name: "Sample Restaurant 1",
      genre: "Italian",
      address: "123 Main St",
      phone: "555-1234",
      description: "A cozy Italian restaurant.",
      imageUrl: "https://via.placeholder.com/150",
      latitude: 34.0522,
      longitude: -118.2437,
      hours: "Mon-Fri: 11am-10pm",
      priceRange: "$$",
      features: ["Outdoor Seating", "Delivery"],
      isOpen: true,
    },
    {
      name: "Sample Restaurant 2",
      genre: "Japanese",
      address: "456 Oak Ave",
      phone: "555-5678",
      description: "Authentic Japanese cuisine.",
      imageUrl: "https://via.placeholder.com/150",
      latitude: 34.0522,
      longitude: -118.2437,
      hours: "Tue-Sun: 12pm-11pm",
      priceRange: "$$$",
      features: ["Takeout"],
      isOpen: true,
    },
  ]).onConflictDoNothing(); // 既に存在する場合は何もしない

  console.log("Database seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
