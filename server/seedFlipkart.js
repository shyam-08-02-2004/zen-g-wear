import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const SEED_COUNT = 100;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();

  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found. Run ensureAdmin.js first.');
      process.exit(1);
    }

    console.log('Clearing old Products and Categories...');
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log('Creating Categories...');
    const catMen = await Category.create({ name: 'Men', slug: 'men', description: 'Men Clothing' });
    const catWomen = await Category.create({ name: 'Women', slug: 'women', description: 'Women Clothing' });
    const catKids = await Category.create({ name: 'Kids', slug: 'kids', description: 'Kids Clothing' });

    const generateProducts = (category, categoryName, startIndex) => {
      const products = [];
      const itemTypes = ['T-Shirt', 'Jeans', 'Jacket', 'Sneakers', 'Hoodie', 'Sweater', 'Shorts'];
      
      for (let i = 1; i <= SEED_COUNT; i++) {
        const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const name = `${categoryName}'s ${itemType} ${i}`;
        const price = Math.floor(Math.random() * 3000) + 399; // Random price between 399 and 3399
        
        products.push({
          name,
          slug: `${categoryName.toLowerCase()}-${itemType.toLowerCase()}-${i}-${Date.now()}`,
          description: `High quality ${itemType} for ${categoryName}. Comfortable and stylish for everyday wear.`,
          price,
          discountPrice: price > 1000 ? price - 200 : null,
          images: [{
            url: `https://via.placeholder.com/400x500.png?text=${categoryName}+${itemType}+${i}`,
            publicId: 'dummy_image_id'
          }],
          category: category._id,
          brand: 'Zen-G',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Black', 'White', 'Blue'],
          stock: Math.floor(Math.random() * 50) + 5,
          isActive: true,
          createdBy: admin._id
        });
      }
      return products;
    };

    console.log('Generating Products...');
    const menProducts = generateProducts(catMen, 'Men', 1);
    const womenProducts = generateProducts(catWomen, 'Women', 1);
    const kidsProducts = generateProducts(catKids, 'Kids', 1);

    console.log('Inserting Men Products...');
    await Product.insertMany(menProducts);
    console.log('Inserting Women Products...');
    await Product.insertMany(womenProducts);
    console.log('Inserting Kids Products...');
    await Product.insertMany(kidsProducts);

    console.log('Database seeded successfully with 300 products!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
