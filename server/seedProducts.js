require('dotenv').config();
const mongoose = require('mongoose');

// 🔴 IMPORTANT: adjust this path if needed
const { Product } = require('./models');

const products = [
  {
    name: "iPhone 15",
    description: "Latest Apple phone",
    price: 80000,
    imageUrl: "/assets/Rubik.jpg",
    stock: 5
  },
  {
    name: "Gaming Mouse",
    description: "RGB mouse",
    price: 1500,
    imageUrl: "/assets/Rubik.jpg",
    stock: 10
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