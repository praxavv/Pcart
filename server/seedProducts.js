require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('./models');

const products = [
  {
    name: "iPhone 15 Pro",
    description: "The latest iPhone with Titanium design and A17 Pro chip.",
    price: 55000,
    imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    stock: 15
  },
  {
    name: "Gaming Mouse RGB",
    description: "High-precision optical sensor with customizable RGB lighting.",
    price: 1500,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800",
    stock: 25
  },
  {
    name: "Classic Rubik's Cube",
    description: "The original 3x3 Rubik's Cube. A challenge for all ages.",
    price: 499,
    imageUrl: "/assets/rubik.jpg",
    stock: 50
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Product.deleteMany();
    console.log("Old products removed");

    await Product.insertMany(products);
    console.log("Products inserted");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
