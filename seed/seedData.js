import dotenv from "dotenv";
import { sequelize, connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import Admin from "../models/Admin.js";

dotenv.config();
await connectDB();
await sequelize.sync(); // ensure tables exist before seeding

const img = (query) =>
  `https://images.unsplash.com/${query}?auto=format&fit=crop&w=900&q=80`;

const products = [
  {
    name: "Frozen Sweet Corn",
    slug: "frozen-sweet-corn",
    category: "Frozen Vegetables",
    shortDescription: "Farm-fresh golden corn kernels, flash-frozen to lock in natural sweetness.",
    description:
      "Our Frozen Sweet Corn is harvested at peak ripeness and flash-frozen within hours to preserve its natural sweetness, crunch, and nutrients. Perfect for salads, soups, curries, and stir-fries, it saves you the hassle of shucking and boiling fresh corn while delivering the same great taste all year round.",
    price: 89,
    unit: "500 g pack",
    stock: 150,
    thumbnail: img("photo-1601493700631-2b16ec4b4716"),
    images: [
      img("photo-1601493700631-2b16ec4b4716"),
      img("photo-1601493700631-2b16ec4b4716"),
      img("photo-1601493700631-2b16ec4b4716"),
    ],
    nutrition: { calories: "86 kcal", protein: "3.2 g", carbs: "19 g", fat: "1.2 g", fiber: "2.7 g" },
    features: ["No preservatives", "Flash-frozen within hours of harvest", "Rich in fiber", "Ready in 3 minutes"],
    isFeatured: true,
    rating: 4.7,
  },
  {
    name: "Frozen Spinach",
    slug: "frozen-spinach",
    category: "Frozen Vegetables",
    shortDescription: "Tender, cleaned spinach leaves, chopped and frozen for everyday convenience.",
    description:
      "Packed with iron and vitamins, our Frozen Spinach is thoroughly washed, blanched, and chopped before freezing — so you get the goodness of fresh spinach without the washing and chopping. Ideal for palak paneer, soups, smoothies, and healthy curries.",
    price: 65,
    unit: "500 g pack",
    stock: 120,
    thumbnail: img("photo-1576045057995-568f588f82fb"),
    images: [
      img("photo-1576045057995-568f588f82fb"),
      img("photo-1576045057995-568f588f82fb"),
      img("photo-1576045057995-568f588f82fb"),
    ],
    nutrition: { calories: "23 kcal", protein: "2.9 g", carbs: "3.6 g", fat: "0.4 g", fiber: "2.2 g" },
    features: ["Pre-washed & chopped", "High in iron", "No added colour", "100% natural"],
    isFeatured: true,
    rating: 4.6,
  },
  {
    name: "Ready to Eat",
    slug: "ready-to-eat",
    category: "Ready To Eat",
    shortDescription: "Convenient, delicious meals that are ready to heat and serve.",
    description:
      "Our Ready to Eat range offers a variety of tasty, nutritious meals that are pre-cooked and frozen for your convenience. Simply reheat and enjoy a wholesome meal without the hassle of cooking from scratch.",
    price: 99,
    unit: "500 g pack",
    stock: 140,
    thumbnail: img("photo-1540420773420-3366772f4999"),
    images: [
      img("photo-1540420773420-3366772f4999"),
      img("photo-1540420773420-3366772f4999"),
      img("photo-1540420773420-3366772f4999"),
    ],
    nutrition: { calories: "65 kcal", protein: "3 g", carbs: "12 g", fat: "0.5 g", fiber: "3.5 g" },
    features: ["4 vegetables in one pack", "IQF technology", "No soaking needed", "Kid-friendly"],
    isFeatured: true,
    rating: 4.8,
  },
  {
    name: "Frozen Green Peas",
    slug: "frozen-green-peas",
    category: "Frozen Vegetables",
    shortDescription: "Sweet, tender green peas shelled and frozen straight from the farm.",
    description:
      "Skip the tedious shelling — our Frozen Green Peas are shelled, sorted, and flash-frozen to retain their natural sweetness and vibrant green colour. A pantry essential for curries, pulao, and everyday cooking.",
    price: 75,
    unit: "500 g pack",
    stock: 200,
    thumbnail: img("photo-1587735243615-c03f25aaff15"),
    images: [
      img("photo-1587735243615-c03f25aaff15"),
      img("photo-1587735243615-c03f25aaff15"),
      img("photo-1587735243615-c03f25aaff15"),
    ],
    nutrition: { calories: "81 kcal", protein: "5.4 g", carbs: "14 g", fat: "0.4 g", fiber: "5.1 g" },
    features: ["Shelled & cleaned", "High in protein", "No grit or debris", "Year-round availability"],
    isFeatured: false,
    rating: 4.6,
  },
  {
    name: "Frozen Cut Beans",
    slug: "frozen-cut-beans",
    category: "Frozen Vegetables",
    shortDescription: "Crisp French beans, trimmed and cut, ready to cook straight from the freezer.",
    description:
      "Our Frozen Cut Beans are hand-trimmed, chopped into even pieces, and frozen to preserve their crunch and colour. No topping, tailing, or chopping needed — just open the pack and cook.",
    price: 69,
    unit: "500 g pack",
    stock: 110,
    thumbnail: img("photo-1567375698348-5d9d5ae99de0"),
    images: [
      img("photo-1567375698348-5d9d5ae99de0"),
      img("photo-1567375698348-5d9d5ae99de0"),
      img("photo-1567375698348-5d9d5ae99de0"),
    ],
    nutrition: { calories: "31 kcal", protein: "1.8 g", carbs: "7 g", fat: "0.1 g", fiber: "3.4 g" },
    features: ["Pre-cut & trimmed", "Retains crunch", "Great for stir-fry", "No added salt"],
    isFeatured: false,
    rating: 4.5,
  },
  {
    name: "Frozen Mangoes",
    slug: "frozen-mangoes",
    category: "Frozen Fruits",
    shortDescription: "Sweet Alphonso mango chunks, frozen at peak ripeness for year-round enjoyment.",
    description:
      "Enjoy the taste of summer all year long with our Frozen Mango chunks, made from handpicked Alphonso mangoes frozen at the peak of ripeness. Perfect for smoothies, shakes, desserts, and ice creams.",
    price: 149,
    unit: "500 g pack",
    stock: 90,
    thumbnail: img("photo-1553279768-865429fa0078"),
    images: [
      img("photo-1553279768-865429fa0078"),
      img("photo-1553279768-865429fa0078"),
      img("photo-1553279768-865429fa0078"),
    ],
    nutrition: { calories: "60 kcal", protein: "0.8 g", carbs: "15 g", fat: "0.4 g", fiber: "1.6 g" },
    features: ["Alphonso mangoes", "No added sugar", "Perfect for smoothies", "Peak-ripeness frozen"],
    isFeatured: true,
    rating: 4.9,
  },
  {
    name: "Frozen Broccoli",
    slug: "frozen-broccoli",
    category: "Frozen Vegetables",
    shortDescription: "Fresh broccoli florets, blanched and frozen to preserve crunch and nutrients.",
    description:
      "Our Frozen Broccoli florets are carefully trimmed, blanched, and frozen to lock in their vibrant colour, crisp texture, and nutrients. A great addition to stir-fries, pastas, soups, and healthy bowls.",
    price: 95,
    unit: "500 g pack",
    stock: 100,
    thumbnail: img("photo-1584270354949-1c78c2ed3f2f"),
    images: [
      img("photo-1584270354949-1c78c2ed3f2f"),
      img("photo-1584270354949-1c78c2ed3f2f"),
      img("photo-1584270354949-1c78c2ed3f2f"),
    ],
    nutrition: { calories: "34 kcal", protein: "2.8 g", carbs: "6.6 g", fat: "0.4 g", fiber: "2.6 g" },
    features: ["Pre-cut florets", "Rich in vitamin C", "Blanched for freshness", "Great for pasta & stir-fry"],
    isFeatured: false,
    rating: 4.6,
  },
  {
    name: "Frozen Carrot",
    slug: "frozen-carrot",
    category: "Frozen Vegetables",
    shortDescription: "Diced carrots frozen fresh, adding colour and sweetness to every dish.",
    description:
      "Our Frozen Carrots are peeled, diced, and frozen soon after harvest to retain their natural sweetness, colour, and crunch. Use them in curries, soups, salads, or vegetable mixes without any prep work.",
    price: 59,
    unit: "500 g pack",
    stock: 130,
    thumbnail: img("photo-1447175008436-054170c2e979"),
    images: [
      img("photo-1447175008436-054170c2e979"),
      img("photo-1447175008436-054170c2e979"),
      img("photo-1447175008436-054170c2e979"),
    ],
    nutrition: { calories: "41 kcal", protein: "0.9 g", carbs: "10 g", fat: "0.2 g", fiber: "2.8 g" },
    features: ["Peeled & diced", "Rich in Vitamin A", "No prep required", "Naturally sweet"],
    isFeatured: false,
    rating: 4.4,
  },
  {
    name: "Frozen Cauliflower",
    slug: "frozen-cauliflower",
    category: "Frozen Vegetables",
    shortDescription: "Clean, bite-sized cauliflower florets ready for your favourite curry.",
    description:
      "Hand-trimmed cauliflower florets, washed and flash-frozen to preserve their fresh taste and firm texture. A versatile addition to curries, parathas, rice dishes, and roasted veggie bowls.",
    price: 79,
    unit: "500 g pack",
    stock: 100,
    thumbnail: img("photo-1568584711271-6c929fb49b60"),
    images: [
      img("photo-1568584711271-6c929fb49b60"),
      img("photo-1568584711271-6c929fb49b60"),
      img("photo-1568584711271-6c929fb49b60"),
    ],
    nutrition: { calories: "25 kcal", protein: "1.9 g", carbs: "5 g", fat: "0.3 g", fiber: "2 g" },
    features: ["Bite-sized florets", "Washed & trimmed", "Low calorie", "Versatile use"],
    isFeatured: false,
    rating: 4.5,
  },
  {
    name: "Frozen Green Bell Pepper (Capsicum)",
    slug: "frozen-capsicum",
    category: "Frozen Vegetables",
    shortDescription: "Diced green capsicum, sweet and crunchy, straight into your wok.",
    description:
      "Our Frozen Capsicum is diced fresh and frozen to lock in its crisp bite and mild sweetness. Perfect for Chinese stir-fries, pizzas, sandwiches, and everyday sabzis — no chopping board needed.",
    price: 72,
    unit: "500 g pack",
    stock: 95,
    thumbnail: img("photo-1563565375-f3fdfdbefa83"),
    images: [
      img("photo-1563565375-f3fdfdbefa83"),
      img("photo-1563565375-f3fdfdbefa83"),
      img("photo-1563565375-f3fdfdbefa83"),
    ],
    nutrition: { calories: "20 kcal", protein: "0.9 g", carbs: "4.6 g", fat: "0.2 g", fiber: "1.7 g" },
    features: ["Pre-diced", "Crunchy texture", "Great for stir-fry & pizza", "No seeds or stem"],
    isFeatured: false,
    rating: 4.3,
  },
  {
    name: "Frozen Green Chilli",
    slug: "frozen-green-chilli",
    category: "Frozen Vegetables",
    shortDescription: "Fiery fresh green chillies, chopped and frozen for everyday tempering.",
    description:
      "Never run out of fresh chillies again. Our Frozen Green Chillies are cleaned, chopped, and frozen to retain their heat and aroma, ready to toss straight into your tadka, chutneys, and curries.",
    price: 49,
    unit: "250 g pack",
    stock: 160,
    thumbnail: img("photo-1592461176253-8bfd44bfba4c"),
    images: [
      img("photo-1592461176253-8bfd44bfba4c"),
      img("photo-1592461176253-8bfd44bfba4c"),
      img("photo-1592461176253-8bfd44bfba4c"),
    ],
    nutrition: { calories: "40 kcal", protein: "1.9 g", carbs: "9 g", fat: "0.4 g", fiber: "1.5 g" },
    features: ["Pre-chopped", "Retains natural heat", "No stems", "Long shelf life"],
    isFeatured: false,
    rating: 4.4,
  },
  {
    name: "Frozen Strawberries",
    slug: "frozen-strawberries",
    category: "Frozen Fruits",
    shortDescription: "Juicy, ripe strawberries frozen whole for desserts, shakes, and smoothies.",
    description:
      "Picked at peak sweetness and individually quick-frozen, our Strawberries make a delicious addition to smoothies, milkshakes, cakes, and desserts — with none of the seasonal wait.",
    price: 159,
    unit: "500 g pack",
    stock: 70,
    thumbnail: img("photo-1518635017498-87f514b751ba"),
    images: [
      img("photo-1518635017498-87f514b751ba"),
      img("photo-1518635017498-87f514b751ba"),
      img("photo-1518635017498-87f514b751ba"),
    ],
    nutrition: { calories: "32 kcal", protein: "0.7 g", carbs: "7.7 g", fat: "0.3 g", fiber: "2 g" },
    features: ["Whole IQF berries", "No added sugar", "Great for desserts", "Peak-season picked"],
    isFeatured: true,
    rating: 4.8,
  },
];

const run = async () => {
  try {
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await Product.bulkCreate(products);
    console.log(`Seeded ${products.length} products.`);

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@kamalnayanfrozen.com").toLowerCase();
    const existingAdmin = await Admin.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await Admin.create({
        name: "Kamal Nayan Admin",
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "Admin@12345",
      });
      console.log(`Admin created -> email: ${adminEmail} / password: ${process.env.ADMIN_PASSWORD || "Admin@12345"}`);
    } else {
      console.log("Admin already exists, skipping admin creation.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

run();
