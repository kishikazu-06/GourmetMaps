//C:\GeminiCLI\TEST\LocalGourmetMaps\server\storage.ts
import { DrizzleStorage } from "./DrizzleStorage.js";
import { MemStorage } from "./MemStorage.js";
import { IStorage } from "./types.js";

let storage: IStorage;

if (process.env.NODE_ENV === "production") {
  console.log("Using DrizzleStorage in production.");
  storage = new DrizzleStorage();
} else {
  console.log("Using MemStorage in development.");
  storage = new MemStorage();
}

export { storage };
