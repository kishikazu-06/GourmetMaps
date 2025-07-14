import { db } from "./drizzle.js";
import { restaurants } from "@shared/schema";

async function seed() {
  console.log("Deleting existing data...");
  await db.delete(restaurants);

  console.log("Seeding database...");

  await db.insert(restaurants).values([
    {
      "name": "MESO",
      "genre": "中華",
      "address": "射水市戸破1730-4",
      "phone": "0766-55-5524",
      "description": "キーマカレードリアセットが有名",
      "imageUrl": "",
      "latitude": 36.723216,
      "longitude": 137.099571,
      "hours": "11～14時 17～22時",
      "priceRange": "1000円～2000円",
      "features": ["キーマカレードリアセット"]
    },
    {
      "name": "ラーメン豚鶏歓",
      "genre": "ラーメン",
      "address": "射水市戸破1730-4",
      "phone": "0766-56-7702",
      "description": "豚鶏歓ラーメンが有名",
      "imageUrl": "",
      "latitude": 36.732958,
      "longitude": 137.098083,
      "hours": "",
      "priceRange": "",
      "features": ["豚鶏歓ラーメン"]
    },
    {
      "name": "中華そば専門いちい",
      "genre": "ラーメン",
      "address": "射水市三ケ802",
      "phone": "0766-55-3333",
      "description": "中華そばが有名",
      "imageUrl": "",
      "latitude": 36.722298,
      "longitude": 137.098983,
      "hours": "10～19時(ラストオーダー18時40分)",
      "priceRange": "1000円～2000円",
      "features": ["中華そば"]
    },
    {
      "name": "とべーぐる•宿カリチーズケーキ小杉店",
      "genre": "焼きたてベーグル専門店",
      "address": "射水市戸破1754-1",
      "phone": "0766-54-0764",
      "description": "ベリーチーズが有名",
      "imageUrl": "",
      "latitude": 36.71642,
      "longitude": 137.09605,
      "hours": "11時～18時",
      "priceRange": "200～1000円",
      "features": ["富山のスイートポテト"]
    },
    {
      "name": "不二家",
      "genre": "食堂　かつ丼　そば",
      "address": "射水市三ケ伊勢領２２８２−２",
      "phone": "0766-56-2557",
      "description": "かつ丼、親子丼が有名",
      "imageUrl": "",
      "latitude": 36.72048,
      "longitude": 137.08834,
      "hours": "11時～15時",
      "priceRange": "1～1000円",
      "features": ["かつ丼", "親子丼", "不二家丼"]
    },
    {
      "name": "李白",
      "genre": "中華",
      "address": "射水市小島１６４−１",
      "phone": "0766-52-1774",
      "description": "マーボーご飯が有名",
      "imageUrl": "",
      "latitude": 36.73738,
      "longitude": 137.05853,
      "hours": "11時半～14時半 17時半～20時半",
      "priceRange": "1000～2000円",
      "features": ["マーボーご飯", "五目焼きそば"]
    },
    {
      "name": "はつ花",
      "genre": "うどん",
      "address": "射水市三ケ２６０２ アルプラ",
      "phone": "0766-57-8286",
      "description": "もつ煮込みうどんが有名",
      "imageUrl": "",
      "latitude": 36.7206,
      "longitude": 137.0926,
      "hours": "11時～14時半",
      "priceRange": "1000～2000円",
      "features": ["もつ煮込みうどん"]
    }
  ]);

  console.log("Database seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
