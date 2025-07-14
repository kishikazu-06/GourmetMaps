//C:\GeminiCLI\TEST\LocalGourmetMaps\server\storage.ts
import { DrizzleStorage } from "./DrizzleStorage";
import { MemStorage } from "./MemStorage";
import { IStorage } from "./types";

let storage: IStorage;

if (process.env.NODE_ENV === "production") {
  storage = new DrizzleStorage();
} else {
  storage = new MemStorage();
}

export { storage };
