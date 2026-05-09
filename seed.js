import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./model/Category.js";
import Product from "./model/Product.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const categories = [
  {
    name: "Coffee",
    description: "Aromatic and energizing coffee beverages",
  },
  {
    name: "Tea",
    description: "Relaxing and soothing tea varieties",
  },
  {
    name: "Pastries",
    description: "Freshly baked pastries and desserts",
  },
  {
    name: "Sandwiches",
    description: "Delicious sandwiches and wraps",
  },
];

const products = [
  {
    name: "Espresso",
    description: "Strong and bold espresso shot",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
    stock: 100,
    category: null, // Will be set after categories are created
  },
  {
    name: "Cappuccino",
    description: "Creamy cappuccino with steamed milk",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    stock: 100,
    category: null,
  },
  {
    name: "Green Tea",
    description: "Refreshing green tea",
    price: 3.00,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
    stock: 50,
    category: null,
  },
  {
    name: "Croissant",
    description: "Buttery and flaky croissant",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    stock: 30,
    category: null,
  },
  {
    name: "Club Sandwich",
    description: "Classic club sandwich with turkey, bacon, and veggies",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400",
    stock: 20,
    category: null,
  },
  {
    name: "Latte",
    description: "Smooth latte with espresso and steamed milk",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400",
    stock: 100,
    category: null,
  },
];

const seedDB = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log("Categories seeded:", createdCategories.length);

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Assign categories to products
    products[0].category = categoryMap["Coffee"]; // Espresso
    products[1].category = categoryMap["Coffee"]; // Cappuccino
    products[2].category = categoryMap["Tea"]; // Green Tea
    products[3].category = categoryMap["Pastries"]; // Croissant
    products[4].category = categoryMap["Sandwiches"]; // Club Sandwich
    products[5].category = categoryMap["Coffee"]; // Latte

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log("Products seeded:", createdProducts.length);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();