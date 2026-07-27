import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const realisticProducts = [
  // MEN
  {
    name: 'Men Premium Graphic Print T-Shirt',
    description: '<p>Upgrade your casual wardrobe with this premium graphic print t-shirt. Crafted from 100% breathable cotton, this t-shirt features a modern fit, crew neck, and high-quality durable print.</p>',
    price: 1299,
    discountPrice: 799,
    discountPercentage: 38,
    categoryName: 't-shirts',
    brand: 'PUMA',
    material: '100% Cotton',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', publicId: 'men_tshirt_1' }],
    rating: 4.5,
    numReviews: 24,
    isFeatured: true
  },
  {
    name: 'Men Slim Fit Casual Shirt',
    description: '<p>A versatile slim-fit casual shirt suitable for office wear and weekend outings. Made from premium cotton-linen blend fabric that keeps you cool and comfortable all day long.</p>',
    price: 1999,
    discountPrice: 1299,
    discountPercentage: 35,
    categoryName: 'shirts',
    brand: 'LEVIS',
    material: 'Cotton Blend',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Light Blue', 'White'],
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=800', publicId: 'men_shirt_1' }],
    rating: 4.2,
    numReviews: 15
  },
  {
    name: 'Men Classic Straight Fit Jeans',
    description: '<p>A timeless wardrobe staple. These classic straight fit jeans offer superior comfort with a slight stretch for ease of movement. Features a 5-pocket styling and zip fly.</p>',
    price: 2999,
    discountPrice: 1799,
    discountPercentage: 40,
    categoryName: 'jeans',
    brand: 'WRANGLER',
    material: '98% Cotton, 2% Elastane',
    sizes: ['30', '32', '34', '36'],
    colors: ['Dark Wash', 'Light Blue'],
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800', publicId: 'men_jeans_1' }],
    rating: 4.8,
    numReviews: 120,
    isBestSeller: true
  },
  // WOMEN
  {
    name: 'Women Elegant Floral Summer Dress',
    description: '<p>Step out in style with this elegant floral summer dress. Featuring a flattering A-line silhouette, v-neck, and lightweight breathable chiffon fabric, perfect for sunny days.</p>',
    price: 2499,
    discountPrice: 1499,
    discountPercentage: 40,
    categoryName: 'dresses',
    brand: 'H&M',
    material: 'Polyester Chiffon',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Pink', 'Floral Blue'],
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800', publicId: 'women_dress_1' }],
    rating: 4.6,
    numReviews: 56,
    isFeatured: true
  },
  {
    name: 'Women Crop Top with Puffed Sleeves',
    description: '<p>Add a trendy touch to your outfit with this stylish crop top. Features puffed sleeves, a square neckline, and a comfortable smocked back for a perfect fit.</p>',
    price: 999,
    discountPrice: 599,
    discountPercentage: 40,
    categoryName: 'tops',
    brand: 'ZARA',
    material: 'Cotton Viscose',
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Yellow'],
    stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800', publicId: 'women_top_1' }],
    rating: 4.3,
    numReviews: 38
  },
  {
    name: 'Women High-Waist Skinny Jeans',
    description: '<p>Flaunt your curves with these high-waist skinny jeans. Made with super-stretch denim for maximum comfort and shape retention. Essential for every modern wardrobe.</p>',
    price: 2299,
    discountPrice: 1399,
    discountPercentage: 39,
    categoryName: 'jeans',
    brand: 'ONLY',
    material: 'Denim',
    sizes: ['26', '28', '30', '32'],
    colors: ['Black', 'Blue'],
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800', publicId: 'women_jeans_1' }],
    rating: 4.7,
    numReviews: 89,
    isTrending: true
  },
  // SHOES
  {
    name: 'Men Sport Running Sneakers',
    description: '<p>Push your limits with these high-performance running sneakers. Features breathable mesh upper, responsive cushioning, and a durable rubber outsole for ultimate traction.</p>',
    price: 4999,
    discountPrice: 2999,
    discountPercentage: 40,
    categoryName: 'shoes',
    brand: 'NIKE',
    material: 'Mesh/Rubber',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Red/Black', 'White/Blue'],
    stock: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', publicId: 'shoes_1' }],
    rating: 4.9,
    numReviews: 210,
    isBestSeller: true
  },
  {
    name: 'Women Classic White Canvas Shoes',
    description: '<p>The ultimate go-to canvas shoes. Minimalist design, durable canvas material, and a comfortable insole make these perfect for everyday casual wear.</p>',
    price: 1599,
    discountPrice: 999,
    discountPercentage: 37,
    categoryName: 'shoes',
    brand: 'CONVERSE',
    material: 'Canvas',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7'],
    colors: ['White', 'Black'],
    stock: 80,
    images: [{ url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800', publicId: 'shoes_2' }],
    rating: 4.4,
    numReviews: 65
  },
  // KIDS
  {
    name: 'Boys Graphic Dinosaur T-Shirt',
    description: '<p>Fun and playful graphic t-shirt for kids. Made with ultra-soft, kid-friendly cotton that is gentle on the skin and durable for active play.</p>',
    price: 699,
    discountPrice: 499,
    discountPercentage: 28,
    categoryName: 'kids',
    brand: 'UNITED COLORS OF BENETTON',
    material: '100% Cotton',
    sizes: ['3-4Y', '5-6Y', '7-8Y'],
    colors: ['Yellow', 'Green'],
    stock: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99abd11d0a38?auto=format&fit=crop&q=80&w=800', publicId: 'kids_1' }],
    rating: 4.6,
    numReviews: 32
  },
  {
    name: 'Girls Cute Ruffle Dress',
    description: '<p>A sweet and adorable ruffle dress for girls. Features cute prints, comfortable fitting, and a soft fabric perfect for parties and casual wear.</p>',
    price: 1299,
    discountPrice: 899,
    discountPercentage: 30,
    categoryName: 'kids',
    brand: 'GAP KIDS',
    material: 'Cotton Blend',
    sizes: ['4-5Y', '6-7Y', '8-9Y'],
    colors: ['Pink', 'White'],
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800', publicId: 'kids_2' }],
    rating: 4.8,
    numReviews: 45,
    isNewArrival: true
  },
  // ACCESSORIES
  {
    name: 'Unisex Minimalist Wrist Watch',
    description: '<p>Elevate your style with this sleek, minimalist wrist watch. Features a premium leather strap, precision quartz movement, and a scratch-resistant glass face.</p>',
    price: 3499,
    discountPrice: 1999,
    discountPercentage: 42,
    categoryName: 'accessories',
    brand: 'FASTRACK',
    material: 'Leather/Stainless Steel',
    sizes: ['Free Size'],
    colors: ['Black/Silver', 'Brown/Gold'],
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800', publicId: 'acc_1' }],
    rating: 4.7,
    numReviews: 88,
    isFeatured: true
  },
  {
    name: 'Premium Leather Crossbody Bag',
    description: '<p>A stylish and practical crossbody bag crafted from genuine leather. Features multiple compartments for easy organization and an adjustable strap.</p>',
    price: 4599,
    discountPrice: 2499,
    discountPercentage: 45,
    categoryName: 'accessories',
    brand: 'CAPRESE',
    material: 'Genuine Leather',
    sizes: ['One Size'],
    colors: ['Tan', 'Black'],
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800', publicId: 'acc_2' }],
    rating: 4.9,
    numReviews: 112,
    isTrending: true
  }
];

const seedRealisticProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('Admin user not found. Please create an admin first.');
      process.exit(1);
    }

    // Prepare Categories map
    const categoriesMap = {};
    const existingCats = await Category.find();
    for (const c of existingCats) {
      categoriesMap[c.name.toLowerCase()] = c._id;
    }

    // Delete existing products
    await Product.deleteMany();
    console.log('Cleared existing products');

    const insertedProducts = [];
    
    for (const prodData of realisticProducts) {
      const catName = prodData.categoryName;
      let categoryId = categoriesMap[catName];
      
      // Create category if not exists
      if (!categoryId) {
        const newCat = await Category.create({
          name: catName,
          slug: catName.replace(/\\s+/g, '-').toLowerCase(),
          description: `All about ${catName}`,
          image: prodData.images[0].url
        });
        categoryId = newCat._id;
        categoriesMap[catName] = categoryId;
        console.log(`Created new category: ${catName}`);
      }

      const slug = prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 4);

      const product = await Product.create({
        ...prodData,
        slug,
        category: categoryId,
        createdBy: adminUser._id
      });
      insertedProducts.push(product);
      console.log(`Inserted: ${product.name}`);
    }

    console.log(`Successfully seeded ${insertedProducts.length} realistic products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedRealisticProducts();
