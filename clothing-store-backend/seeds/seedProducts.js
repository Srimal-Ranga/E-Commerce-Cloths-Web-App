require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product,js');
const connectDB = require('../config/db.js');

const products = [
  // Men's Category
  {
    name: "Classic Fit Denim Jeans",
    description: "Comfortable classic fit jeans made from premium denim. Perfect for everyday wear with a timeless style.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Casual Cotton T-Shirt",
    description: "Soft 100% cotton t-shirt with a relaxed fit. Available in multiple sizes for maximum comfort.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Slim Fit Polo Shirt",
    description: "Modern slim fit polo shirt made from breathable fabric. Perfect for both casual and semi-formal occasions.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Lightweight Summer Shorts",
    description: "Breathable and comfortable shorts perfect for summer activities. Features multiple pockets for convenience.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Formal Dress Shirt",
    description: "Elegant dress shirt perfect for business meetings and formal events. Easy care, wrinkle-resistant fabric.",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1602810318660-d1970c19b26c?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"]
  },

  // Women's Category
  {
    name: "Floral Print Summer Dress",
    description: "Beautiful floral print dress perfect for summer outings. Lightweight and comfortable with a flattering fit.",
    price: 69.99,
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
    category: "Women",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "High-Waisted Skinny Jeans",
    description: "Stylish high-waisted jeans with a skinny fit. Stretchy denim for all-day comfort and style.",
    price: 64.99,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    category: "Women",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Casual Blouse",
    description: "Versatile blouse suitable for work or casual wear. Soft fabric with elegant draping.",
    price: 44.99,
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500",
    category: "Women",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Yoga Leggings",
    description: "High-performance leggings perfect for yoga, running, or everyday wear. Moisture-wicking and stretchy.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
    category: "Women",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Knitted Cardigan",
    description: "Cozy knitted cardigan perfect for layering. Soft and warm with a classic design.",
    price: 54.99,
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
    category: "Women",
    sizes: ["S", "M", "L", "XL"]
  },

  // Kids' Category
  {
    name: "Kids Graphic T-Shirt",
    description: "Fun graphic t-shirt for kids featuring colorful designs. Made from soft, durable cotton.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500",
    category: "Kids",
    sizes: ["S", "M", "L"]
  },
  {
    name: "Kids Denim Jacket",
    description: "Classic denim jacket sized for kids. Durable and stylish for any season.",
    price: 44.99,
    imageUrl: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e4?w=500",
    category: "Kids",
    sizes: ["S", "M", "L"]
  },
  {
    name: "Kids Hoodie",
    description: "Comfortable pullover hoodie for kids. Perfect for playtime or casual wear.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Kids Cargo Pants",
    description: "Practical cargo pants with multiple pockets. Durable and comfortable for active kids.",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
    category: "Kids",
    sizes: ["S", "M", "L"]
  },
  {
    name: "Kids Summer Dress",
    description: "Adorable summer dress for kids. Light, breathable fabric with cute patterns.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"]
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Existing products removed');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Products seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();