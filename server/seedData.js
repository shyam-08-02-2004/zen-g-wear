import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Realistic product names for generation
const menItems = ['Premium T-Shirt', 'Slim Fit Jeans', 'Classic Polo', 'Oxford Shirt', 'Denim Jacket', 'Chino Pants', 'Graphic Tee', 'Leather Jacket', 'Cargo Shorts', 'Wool Sweater'];
const womenItems = ['Floral Dress', 'High-Waist Jeans', 'Silk Blouse', 'Pleated Skirt', 'Crop Top', 'Maxi Dress', 'Trench Coat', 'Cardigan', 'Skinny Jeans', 'Summer Tunic'];
const kidsItems = ['Boys Graphic Tee', 'Girls Party Dress', 'Toddler Jumpsuit', 'Kids Denim Shorts', 'Baby Romper', 'School Uniform Shirt', 'Kids Winter Coat', 'Boys Chinos', 'Girls Skirt', 'Kids Sleepwear'];

// Curated Unsplash images that look like Flipkart/Myntra catalog images
const menImages = [
  'https://images.unsplash.com/photo-1516826957135-73ff61a8b062?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1489987707023-afc3161ce9fd?auto=format&fit=crop&w=600&q=80'
];

const womenImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1502716115624-b56ef3145124?auto=format&fit=crop&w=600&q=80'
];

const kidsImages = [
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1560506840-0ca68ee18cc9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1622290319146-7b63fd48a609?auto=format&fit=crop&w=600&q=80'
];

const brands = ['Zen-G', 'Urban Core', 'Minimal', 'Luxe', 'Essentials'];

const generateProducts = (categoryName, categoryId, adminId, count, namesList, imagesList) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const baseName = namesList[Math.floor(Math.random() * namesList.length)];
    const price = Math.floor(Math.random() * (4000 - 499 + 1)) + 499;
    const hasDiscount = Math.random() > 0.3;
    const discountPrice = hasDiscount ? Math.floor(price * (Math.random() * (0.9 - 0.5) + 0.5)) : undefined;
    
    products.push({
      name: `${baseName} - ${categoryName} Style ${i+1}`,
      slug: `${categoryName.toLowerCase()}-${baseName.toLowerCase().replace(/ /g, '-')}-${i+1}-${Date.now()}`,
      description: `Premium quality ${baseName.toLowerCase()} designed for ${categoryName.toLowerCase()}. Crafted with attention to detail to provide the ultimate comfort and style. Perfect for everyday wear or special occasions.`,
      price: price,
      discountPrice: discountPrice,
      images: [
        {
          url: imagesList[Math.floor(Math.random() * imagesList.length)],
          publicId: `dummy_${categoryName}_${i}`
        }
      ],
      category: categoryId,
      brand: brands[Math.floor(Math.random() * brands.length)],
      material: '100% Cotton',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy', 'Olive'],
      stock: Math.floor(Math.random() * 100) + 10,
      isActive: true,
      isFeatured: Math.random() > 0.8,
      isTrending: Math.random() > 0.8,
      isBestSeller: Math.random() > 0.9,
      isNewArrival: Math.random() > 0.7,
      createdBy: adminId
    });
  }
  return products;
};

const importData = async () => {
  await connectDB();

  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found! Please create an admin user first.');
      process.exit(1);
    }

    // Ensure categories exist
    const categoryNames = ['Men', 'Women', 'Kids'];
    const categoryDocs = {};
    
    for (const catName of categoryNames) {
      let cat = await Category.findOne({ name: catName });
      if (!cat) {
        cat = await Category.create({ name: catName, slug: catName.toLowerCase(), description: `${catName} fashion` });
      }
      categoryDocs[catName] = cat._id;
    }

    console.log('Generating dummy data...');
    const menData = generateProducts('Men', categoryDocs['Men'], admin._id, 200, menItems, menImages);
    const womenData = generateProducts('Women', categoryDocs['Women'], admin._id, 200, womenItems, womenImages);
    const kidsData = generateProducts('Kids', categoryDocs['Kids'], admin._id, 200, kidsItems, kidsImages);

    const allProducts = [...menData, ...womenData, ...kidsData];

    console.log(`Inserting ${allProducts.length} products...`);
    await Product.insertMany(allProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with import: ${error.message}`);
    process.exit(1);
  }
};

importData();
