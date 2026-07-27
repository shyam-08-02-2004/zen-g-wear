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

const menItems = ['Oversized T-Shirt', 'Slim Fit Denim', 'Polo Collar T-Shirt', 'Casual Checked Shirt', 'Bomber Jacket', 'Straight Fit Trousers', 'Printed Round Neck T-shirt', 'Solid Biker Jacket', 'Cotton Cargo Shorts', 'Turtleneck Sweater'];
const womenItems = ['A-Line Midi Dress', 'High-Rise Flared Jeans', 'Georgette Top', 'Pleated A-Line Skirt', 'Ribbed Crop Top', 'Floral Maxi Dress', 'Classic Trench Coat', 'V-Neck Cardigan', 'Skinny Fit Jeggings', 'Embroidered Kurta'];
const kidsItems = ['Boys Marvel Graphic Tee', 'Girls Party Wear Dress', 'Infant Cotton Jumpsuit', 'Kids Denim Dungarees', 'Baby Printed Romper', 'Boys Formal Shirt', 'Kids Hooded Winter Coat', 'Boys Casual Chinos', 'Girls Flared Skirt', 'Kids Character Sleepwear'];

// Highly curated, white/clean background fashion images for that "Flipkart/Myntra" look
const menImages = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', // white t-shirt on white bg
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80', // black t-shirt 
  'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80', // jeans
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', // jacket
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80', // hoodie
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80', // shirt flatlay
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'  // black shirt
];

const womenImages = [
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80', // dress flatlay
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', // dress model
  'https://images.unsplash.com/photo-1583846663523-28952d765870?auto=format&fit=crop&w=600&q=80', // women top
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80', // fashion model
  'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=600&q=80', // women shirt
  'https://images.unsplash.com/photo-1434389670869-c87520fca730?auto=format&fit=crop&w=600&q=80', // hanger clothes
  'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=600&q=80'  // heels/accessory
];

const kidsImages = [
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80', // baby
  'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=600&q=80', // kids clothes flatlay
  'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80', // baby onesie
  'https://images.unsplash.com/photo-1560506840-0ca68ee18cc9?auto=format&fit=crop&w=600&q=80', // kids shoes
  'https://images.unsplash.com/photo-1622290319146-7b63fd48a609?auto=format&fit=crop&w=600&q=80', // baby dress
  'https://images.unsplash.com/photo-1514090288897-40082f170af3?auto=format&fit=crop&w=600&q=80'  // kids fashion
];

const brands = ['Roadster', 'HRX', 'Puma', 'Zara', 'H&M', 'Levis', 'Allen Solly'];

const generateProducts = (categoryName, categoryId, adminId, count, namesList, imagesList) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const baseName = namesList[Math.floor(Math.random() * namesList.length)];
    const price = Math.floor(Math.random() * (2999 - 499 + 1)) + 499;
    const hasDiscount = Math.random() > 0.3;
    const discountPrice = hasDiscount ? Math.floor(price * (Math.random() * (0.9 - 0.5) + 0.5)) : undefined;
    
    // Pick two random unique images for primary and hover effect
    const img1 = imagesList[Math.floor(Math.random() * imagesList.length)];
    let img2 = imagesList[Math.floor(Math.random() * imagesList.length)];
    if (img1 === img2 && imagesList.length > 1) {
      img2 = imagesList[(imagesList.indexOf(img1) + 1) % imagesList.length];
    }
    
    products.push({
      name: baseName,
      slug: `${categoryName.toLowerCase()}-${baseName.toLowerCase().replace(/ /g, '-')}-${i+1}-${Date.now()}`,
      description: `Upgrade your wardrobe with this stylish ${baseName.toLowerCase()}. Crafted with premium materials for maximum comfort and durability. Perfect for any casual outing or event.`,
      price: price,
      discountPrice: discountPrice,
      images: [
        { url: img1, publicId: `img1_${i}` },
        { url: img2, publicId: `img2_${i}` }
      ],
      category: categoryId,
      brand: brands[Math.floor(Math.random() * brands.length)],
      material: '100% Cotton / Premium Blend',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Navy Blue', 'Olive Green', 'Maroon'],
      stock: Math.floor(Math.random() * 50) + 10,
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
      console.error('No admin user found!');
      process.exit(1);
    }

    console.log('Cleaning up old products...');
    await Product.deleteMany({}); // Clear old products so we don't have duplicates

    // Ensure categories exist
    const categoryNames = ['Men', 'Women', 'Kids'];
    const categoryDocs = {};
    
    for (const catName of categoryNames) {
      let cat = await Category.findOne({ slug: catName.toLowerCase() });
      if (!cat) {
        cat = await Category.create({ name: catName, slug: catName.toLowerCase(), description: `${catName} fashion` });
      }
      categoryDocs[catName] = cat._id;
    }

    console.log('Generating dummy data with better images...');
    const menData = generateProducts('Men', categoryDocs['Men'], admin._id, 200, menItems, menImages);
    const womenData = generateProducts('Women', categoryDocs['Women'], admin._id, 200, womenItems, womenImages);
    const kidsData = generateProducts('Kids', categoryDocs['Kids'], admin._id, 200, kidsItems, kidsImages);

    const allProducts = [...menData, ...womenData, ...kidsData];

    console.log(`Inserting ${allProducts.length} premium products...`);
    await Product.insertMany(allProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with import: ${error.message}`);
    process.exit(1);
  }
};

importData();
