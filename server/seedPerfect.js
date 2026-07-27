import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Category from './models/Category.js';

dotenv.config();

const PERFECT_PRODUCTS = [
  // MENS
  {
    name: "Men's Premium Cotton White T-Shirt",
    brand: "Polo Ralph",
    category: "men",
    description: "Classic white cotton t-shirt for everyday wear. Super comfortable and breathable.",
    price: 999,
    discountPrice: 499,
    countInStock: 50,
    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.8, numReviews: 120
  },
  {
    name: "Men's Slim Fit Blue Jeans",
    brand: "Levi's",
    category: "men",
    description: "Stylish blue denim jeans with a slim fit profile.",
    price: 2499,
    discountPrice: 1499,
    countInStock: 30,
    images: [{ url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.5, numReviews: 89
  },
  {
    name: "Men's Black Leather Jacket",
    brand: "Zara",
    category: "men",
    description: "Premium black leather jacket for a bold look.",
    price: 4999,
    discountPrice: 2999,
    countInStock: 15,
    images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.9, numReviews: 210
  },
  {
    name: "Men's Formal Oxford Shoes",
    brand: "Hush Puppies",
    category: "men",
    description: "Elegant brown oxford shoes for formal occasions.",
    price: 3500,
    discountPrice: 2100,
    countInStock: 25,
    images: [{ url: "https://images.unsplash.com/photo-1614252339460-e1762c2f42a9?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.6, numReviews: 76
  },
  {
    name: "Men's Casual Check Shirt",
    brand: "Roadster",
    category: "men",
    description: "Red and black checked flannel shirt.",
    price: 1299,
    discountPrice: 799,
    countInStock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.3, numReviews: 55
  },

  // WOMENS
  {
    name: "Women's Floral Summer Dress",
    brand: "H&M",
    category: "women",
    description: "Light and breezy floral dress perfect for summer days.",
    price: 1999,
    discountPrice: 1199,
    countInStock: 45,
    images: [{ url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.7, numReviews: 140
  },
  {
    name: "Women's High-Waist Skinny Jeans",
    brand: "Forever 21",
    category: "women",
    description: "Flattering high-waist jeans in classic blue.",
    price: 1899,
    discountPrice: 999,
    countInStock: 35,
    images: [{ url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.5, numReviews: 92
  },
  {
    name: "Women's Designer Handbag",
    brand: "Caprese",
    category: "women",
    description: "Chic leather handbag for everyday elegance.",
    price: 3499,
    discountPrice: 2299,
    countInStock: 20,
    images: [{ url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.8, numReviews: 115
  },
  {
    name: "Women's White Sneakers",
    brand: "Puma",
    category: "women",
    description: "Comfortable and trendy white sneakers.",
    price: 2999,
    discountPrice: 1799,
    countInStock: 50,
    images: [{ url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.6, numReviews: 205
  },
  {
    name: "Women's Silk Scarf",
    brand: "FabIndia",
    category: "women",
    description: "Beautiful patterned silk scarf.",
    price: 899,
    discountPrice: 599,
    countInStock: 60,
    images: [{ url: "https://images.unsplash.com/photo-1601924349924-f7b2e15770a3?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.4, numReviews: 45
  },

  // KIDS
  {
    name: "Boy's Superhero T-Shirt",
    brand: "Disney",
    category: "kids",
    description: "Fun and vibrant superhero t-shirt for kids.",
    price: 799,
    discountPrice: 399,
    countInStock: 80,
    images: [{ url: "https://images.unsplash.com/photo-1519238396255-a2267f815048?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.9, numReviews: 320
  },
  {
    name: "Girl's Princess Party Dress",
    brand: "Mothercare",
    category: "kids",
    description: "Beautiful pink dress for special occasions.",
    price: 1499,
    discountPrice: 899,
    countInStock: 30,
    images: [{ url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.8, numReviews: 150
  },
  {
    name: "Kid's Colorful Sneakers",
    brand: "Nike",
    category: "kids",
    description: "Comfortable running shoes for active kids.",
    price: 2199,
    discountPrice: 1299,
    countInStock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.6, numReviews: 95
  },

  // WATCHES
  {
    name: "Luxury Men's Chronograph Watch",
    brand: "Fossil",
    category: "watches",
    description: "Silver stainless steel analog watch.",
    price: 8999,
    discountPrice: 5499,
    countInStock: 25,
    images: [{ url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.9, numReviews: 410
  },
  {
    name: "Women's Rose Gold Smartwatch",
    brand: "Titan",
    category: "watches",
    description: "Elegant smart watch with fitness tracking.",
    price: 5999,
    discountPrice: 3999,
    countInStock: 35,
    images: [{ url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.7, numReviews: 280
  },
  {
    name: "Classic Leather Strap Watch",
    brand: "Daniel Wellington",
    category: "watches",
    description: "Minimalist dial with a brown leather strap.",
    price: 6500,
    discountPrice: 4200,
    countInStock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.8, numReviews: 190
  },

  // BEAUTY (Perfumes etc)
  {
    name: "Chanel No. 5 Luxury Perfume",
    brand: "Chanel",
    category: "beauty",
    description: "Classic floral fragrance for women.",
    price: 12000,
    discountPrice: 9500,
    countInStock: 15,
    images: [{ url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.9, numReviews: 500
  },
  {
    name: "Men's Aqua Marine Cologne",
    brand: "Bvlgari",
    category: "beauty",
    description: "Fresh oceanic scent for men.",
    price: 4500,
    discountPrice: 3200,
    countInStock: 30,
    images: [{ url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.6, numReviews: 210
  },
  {
    name: "Matte Red Lipstick",
    brand: "MAC",
    category: "beauty",
    description: "Long-lasting matte finish red lipstick.",
    price: 1800,
    discountPrice: 1200,
    countInStock: 60,
    images: [{ url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.8, numReviews: 340
  },

  // GLASSES
  {
    name: "Classic Aviator Sunglasses",
    brand: "Ray-Ban",
    category: "glasses",
    description: "Timeless aviator shades with green lenses.",
    price: 4990,
    discountPrice: 3490,
    countInStock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.9, numReviews: 450
  },
  {
    name: "Retro Round Reading Glasses",
    brand: "Lenskart",
    category: "glasses",
    description: "Stylish anti-glare reading glasses.",
    price: 1500,
    discountPrice: 999,
    countInStock: 55,
    images: [{ url: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80" }],
    rating: 4.5, numReviews: 120
  }
];

// Add a default admin ID since we need a user field
const ADMIN_ID = "66a337eb14a42b153b6cc3c8"; // Dummy, will be overwritten if needed

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Perfect Seeding...');

    // We only clear the Products to replace them with perfect ones
    await Product.deleteMany();
    console.log('Cleared existing products.');

    const adminUser = await User.findOne({ role: 'admin' });
    const createdBy = adminUser ? adminUser._id : ADMIN_ID;

    // Fetch categories and map by slug
    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    const productsToInsert = PERFECT_PRODUCTS.map(p => {
      const catId = categoryMap[p.category] || categoryMap['men']; // fallback
      return {
        name: p.name,
        brand: p.brand,
        category: catId,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.countInStock,
        images: p.images.map(img => ({ url: img.url, publicId: 'dummy_pub_id' })),
        rating: p.rating,
        numReviews: p.numReviews,
        createdBy,
        discountPercentage: p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0,
        slug: p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      };
    });

    await Product.insertMany(productsToInsert);
    
    console.log(`Successfully seeded ${productsToInsert.length} PERFECT products!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
