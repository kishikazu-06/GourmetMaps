import { IStorage, MemStorage } from "./storage";
import { DrizzleStorage } from "./DrizzleStorage";

let storage: IStorage;

if (process.env.NODE_ENV === "production") {
  storage = new DrizzleStorage();
} else {
  storage = new MemStorage();
}

export { storage, IStorage };