import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear';

const MENS_IMAGES = [
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1593030761757-71fae4630b14?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1620012253295-c15bc3e65e4e?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1489987707023-afc152d5d346?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1617127365659-6ea43a1309e4?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1507680434267-dc43501a4e1d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1602811400073-6130b1c0b431?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1588806282110-381c81ef4f7c?auto=format&fit=crop&w=500&q=80'
];

const WOMENS_IMAGES = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1583391733959-f18305540858?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1485230895905-ef059df30bb2?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1511130558090-00af810c2111?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1550614000-4b95d4662d5f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=500&q=80'
];

const KIDS_IMAGES = [
  'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1519238398260-24422e6dc148?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1471286174890-9c112abcd5f3?auto=format&fit=crop&w=500&q=80'
];

const CATEGORIES = ['men', 'women', 'kids'];

const SUBCATEGORIES = {
  men: ['tshirt', 'shirt', 'hoodie', 'sweatshirt', 'jacket', 'blazer', 'jeans', 'trousers', 'shorts', 'trackpants', 'joggers', 'cargo', 'vest', 'brief', 'boxer', 'innerwear', 'socks', 'sportsshoes', 'casualshoes', 'formalshoes', 'sandals', 'slippers', 'watches', 'belt', 'wallet', 'cap', 'sunglasses', 'ethnicwear'],
  women: ['dress', 'top', 'tshirt', 'shirt', 'hoodie', 'sweatshirt', 'jacket', 'jeans', 'trousers', 'leggings', 'palazzo', 'skirt', 'kurti', 'kurta', 'saree', 'lehenga', 'ethnicwear', 'bra', 'panty', 'sportsbra', 'lingerie', 'shapewear', 'nightwear', 'heels', 'flats', 'sneakers', 'sandals', 'handbag', 'wallet', 'jewellery', 'watches', 'beauty', 'accessories'],
  kids: ['boysclothing', 'girlsclothing', 'babyclothing', 'tshirt', 'shirt', 'jeans', 'shorts', 'frock', 'dress', 'schooluniform', 'winterwear', 'schoolbag', 'shoes', 'sandals', 'watches', 'cap', 'toys', 'babycare', 'accessories']
};

const BRANDS = {
  men: ['Puma', 'Nike', 'Adidas', 'Levis', 'U.S. Polo Assn.', 'Tommy Hilfiger', 'Calvin Klein', 'Wrogn', 'HRX', 'Roadster'],
  women: ['Biba', 'W', 'Vero Moda', 'Only', 'H&M', 'Zara', 'Forever 21', 'Aurelia', 'Libas', 'Anouk'],
  kids: ['Mothercare', 'Gini & Jony', 'U.S. Polo Assn. Kids', 'Max', 'Allen Solly Junior', 'United Colors of Benetton', 'Pepe Jeans']
};

const MATERIALS = ['Cotton', 'Polyester', 'Denim', 'Silk', 'Linen', 'Wool', 'Blend', 'Viscose', 'Leather', 'Synthetic'];

const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Grey', 'Brown', 'Navy', 'Olive'];

const SIZES = {
  men: ['S', 'M', 'L', 'XL', 'XXL'],
  women: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  kids: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y', '13-14Y']
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

const generateProduct = (categoryId, categorySlug, adminId, index) => {
  const subcategory = getRandomElement(SUBCATEGORIES[categorySlug]);
  const brand = getRandomElement(BRANDS[categorySlug]);
  
  let imageArray = MENS_IMAGES;
  if (categorySlug === 'women') imageArray = WOMENS_IMAGES;
  if (categorySlug === 'kids') imageArray = KIDS_IMAGES;

  const imageUrl = getRandomElement(imageArray);
  
  const basePrice = getRandomInt(399, 5999);
  const discountPercentage = getRandomInt(10, 80);
  const discountPrice = Math.floor(basePrice - (basePrice * discountPercentage) / 100);

  const colors = [getRandomElement(COLORS)];
  if (Math.random() > 0.5) colors.push(getRandomElement(COLORS));
  
  const selectedSizes = SIZES[categorySlug].slice(0, getRandomInt(3, SIZES[categorySlug].length));

  return {
    name: `${brand} ${getRandomElement(['Premium', 'Casual', 'Classic', 'Stylish', 'Trendy', 'Elegant', 'Comfortable'])} ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} - ${index}`,
    slug: `product-${categorySlug}-${subcategory}-${index}-${Math.random().toString(36).substr(2, 5)}`.toLowerCase(),
    description: `Experience the perfect blend of style and comfort with this ${brand} product. Crafted with premium ${getRandomElement(MATERIALS)}, it offers a great fit and long-lasting durability. Perfect for any occasion.`,
    price: basePrice,
    discountPrice: discountPrice,
    discountPercentage: discountPercentage,
    sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    images: [{ url: imageUrl, publicId: `seed-${Date.now()}` }],
    category: categoryId,
    subcategory: subcategory,
    brand: brand,
    material: getRandomElement(MATERIALS),
    sizes: selectedSizes,
    colors: [...new Set(colors)],
    stock: getRandomInt(10, 500),
    isActive: true,
    isFeatured: Math.random() > 0.9,
    isTrending: Math.random() > 0.8,
    isBestSeller: Math.random() > 0.85,
    isNewArrival: Math.random() > 0.7,
    rating: parseFloat(getRandomFloat(3.0, 5.0)),
    numReviews: getRandomInt(0, 1500),
    createdBy: adminId
  };
};

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Get an admin user
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Creating a dummy admin...');
      adminUser = await User.create({
        name: 'Seed Admin',
        email: 'admin@seed.com',
        password: 'password123',
        role: 'admin',
        isVerified: true
      });
    }

    console.log('Wiping existing categories and products...');
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log('Creating root categories...');
    const createdCategories = {};
    for (const catName of CATEGORIES) {
      const cat = await Category.create({
        name: catName.charAt(0).toUpperCase() + catName.slice(1),
        slug: catName,
        image: { url: `https://images.unsplash.com/photo-1507680434267-dc43501a4e1d?w=200`, publicId: 'cat-seed' },
        description: `Everything for ${catName}`,
        isActive: true
      });
      createdCategories[catName] = cat._id;
    }

    console.log('Categories created:', Object.keys(createdCategories));

    console.log('Generating 2000 realistic products (This might take a minute)...');
    
    const productsToInsert = [];
    const TOTAL_PRODUCTS = 2000;
    
    for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
      // Distribute evenly
      let catSlug = 'men';
      if (i % 3 === 1) catSlug = 'women';
      if (i % 3 === 2) catSlug = 'kids';

      const product = generateProduct(createdCategories[catSlug], catSlug, adminUser._id, i);
      productsToInsert.push(product);
    }

    console.log(`Inserting ${productsToInsert.length} products...`);
    
    // Insert in batches of 500 to avoid memory issues
    const BATCH_SIZE = 500;
    for (let i = 0; i < productsToInsert.length; i += BATCH_SIZE) {
      const batch = productsToInsert.slice(i, i + BATCH_SIZE);
      await Product.insertMany(batch);
      console.log(`Inserted ${Math.min(i + BATCH_SIZE, productsToInsert.length)} / ${productsToInsert.length}`);
    }

    console.log('✅ Database Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
