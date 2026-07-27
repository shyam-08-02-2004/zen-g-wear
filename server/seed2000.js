import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

// Helpers
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateSKU = () => 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase();

// Data pools
const catalogs = {
  men: {
    brands: ['PUMA', 'LEVIS', 'WRANGLER', 'TOMMY HILFIGER', 'CALVIN KLEIN', 'ZARA MAN', 'H&M', 'JACK & JONES', 'NIKE', 'ADIDAS', 'FASTRACK', 'RAY-BAN'],
    items: [
      { type: 'T-Shirt', keyword: 'mens,tshirt,product' },
      { type: 'Shirt', keyword: 'mens,shirt,product' },
      { type: 'Jeans', keyword: 'mens,jeans,product' },
      { type: 'Pant', keyword: 'mens,pants,product' },
      { type: 'Lower / Trackpant', keyword: 'mens,trackpant,product' },
      { type: 'Sneaker Shoes', keyword: 'mens,sneakers,product' },
      { type: 'Sports Shoes', keyword: 'mens,sportshoes,product' },
      { type: 'Sunglasses', keyword: 'mens,sunglasses,product' },
      { type: 'Analog Watch', keyword: 'mens,watch,product' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'UK 8', 'UK 9'],
    imageCat: 'men'
  },
  women: {
    brands: ['ZARA', 'H&M', 'MANGO', 'ONLY', 'VERO MODA', 'BIBA', 'W FOR WOMAN', 'PUMA', 'BATA', 'FASTRACK', 'LAKME', 'MAYBELLINE'],
    items: [
      { type: 'T-Shirt', keyword: 'womens,tshirt,product' },
      { type: 'Kurti', keyword: 'womens,kurti,product' },
      { type: 'Jeans', keyword: 'womens,jeans,product' },
      { type: 'Lower / Legging', keyword: 'womens,leggings,product' },
      { type: 'Heels', keyword: 'womens,heels,product' },
      { type: 'Casual Shoes', keyword: 'womens,shoes,product' },
      { type: 'Sunglasses', keyword: 'womens,sunglasses,product' },
      { type: 'Handbag', keyword: 'womens,handbag,product' },
      { type: 'Perfume', keyword: 'womens,perfume,product' },
      { type: 'Lipstick', keyword: 'lipstick,product' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'UK 5', 'UK 6'],
    imageCat: 'women'
  },
  kids: {
    brands: ['GAP KIDS', 'MOTHERCARE', 'UNITED COLORS OF BENETTON', 'H&M KIDS', 'MAX', 'PUMA KIDS', 'CROCS'],
    items: [
      { type: 'T-Shirt', keyword: 'kids,tshirt,product' },
      { type: 'Jeans', keyword: 'kids,jeans,product' },
      { type: 'Shorts', keyword: 'kids,shorts,product' },
      { type: 'Lower / Trackpant', keyword: 'kids,trackpants,product' },
      { type: 'Shoes', keyword: 'kids,shoes,product' },
      { type: 'Sandals', keyword: 'kids,sandals,product' },
      { type: 'Sunglasses', keyword: 'kids,sunglasses,product' }
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y', 'UK 1', 'UK 2'],
    imageCat: 'kids'
  },
  watches: {
    brands: ['CASIO', 'FOSSIL', 'TITAN', 'FASTRACK', 'ROLEX', 'G-SHOCK'],
    items: [
      { type: 'Analog Watch', keyword: 'watch,product' },
      { type: 'Smart Watch', keyword: 'smartwatch,product' }
    ],
    sizes: ['One Size'],
    imageCat: 'watches'
  },
  beauty: {
    brands: ['MAC', 'MAYBELLINE', 'LAKME', 'NYKAA', 'DIOR', 'CHANEL'],
    items: [
      { type: 'Perfume', keyword: 'perfume,product' },
      { type: 'Face Wash', keyword: 'facewash,product' }
    ],
    sizes: ['Standard'],
    imageCat: 'beauty'
  },
  glasses: {
    brands: ['RAY-BAN', 'OAKLEY', 'FASTRACK', 'VOGUE'],
    items: [
      { type: 'Sunglasses', keyword: 'sunglasses,product' },
      { type: 'Aviators', keyword: 'aviators,product' }
    ],
    sizes: ['One Size'],
    imageCat: 'glasses'
  }
};

const adjectives = ['Premium', 'Classic', 'Modern', 'Elegant', 'Casual', 'Stylish', 'Trendy'];
const colorsPool = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Brown', 'Gold', 'Silver', 'Pink'];
const categoryImages = {
  men: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
  women: 'https://images.unsplash.com/photo-1434389670869-c4db2334084f?auto=format&fit=crop&q=80&w=800',
  kids: 'https://images.unsplash.com/photo-1471286174890-9c1122cd79fc?auto=format&fit=crop&q=80&w=800',
  watches: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800',
  glasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
};

const generateProduct = (categoryName, adminUserId, categoryId, uniqueId) => {
  const catData = catalogs[categoryName];
  const brand = getRandomItem(catData.brands);
  const adjective = getRandomItem(adjectives);
  const itemObj = getRandomItem(catData.items);
  const type = itemObj.type;
  
  // Using 'product' and 'ecommerce' tags to try and get isolated product shots like Flipkart
  const image = `https://loremflickr.com/600/800/${itemObj.keyword},ecommerce?lock=${uniqueId}`;
  
  const color = getRandomItem(colorsPool);
  const finalName = `${brand} ${adjective} ${type} - ${color}`;
  
  let basePrice = getRandomInt(8, 60) * 100;
  const discountPercentage = getRandomInt(10, 70);
  const discountPrice = Math.floor(basePrice * (1 - discountPercentage / 100));
  
  const selectedColors = Array.from(new Set([color, getRandomItem(colorsPool)])).slice(0, 2);
  const selectedSizes = catData.sizes;
  
  const slug = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 8);

  return {
    name: finalName,
    slug,
    description: `<p>100% Original Product. Discover the perfect blend of style and quality with this ${adjective.toLowerCase()} ${type.toLowerCase()} by ${brand}. Carefully crafted to ensure durability and an excellent experience.</p>`,
    price: basePrice,
    discountPrice,
    discountPercentage,
    category: categoryId,
    brand,
    material: 'Premium Quality',
    sizes: selectedSizes,
    colors: selectedColors,
    stock: getRandomInt(20, 300),
    images: [{ url: image, publicId: `img_${uniqueId}` }],
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    numReviews: getRandomInt(10, 3000),
    isFeatured: Math.random() > 0.85,
    isTrending: Math.random() > 0.85,
    isBestSeller: Math.random() > 0.8,
    isNewArrival: Math.random() > 0.8,
    createdBy: adminUserId,
    sku: generateSKU()
  };
};

const seed2000 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('Admin user not found!');
      process.exit(1);
    }

    // Clear existing products and categories
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('Cleared existing products and categories');

    // Create new categories
    const categoriesMap = {};
    for (const catName of Object.keys(catalogs)) {
      const cat = await Category.create({
        name: catName.charAt(0).toUpperCase() + catName.slice(1),
        slug: catName,
        description: `Shop the best in ${catName}`,
        image: categoryImages[catName]
      });
      categoriesMap[catName] = cat._id;
    }

    // Generate products per category
    const allProducts = [];
    let uniqueIdCounter = 1;

    for (const catName of Object.keys(catalogs)) {
      // Allocate more to men, women, kids
      let totalPerCategory = 200;
      if (catName === 'men' || catName === 'women') totalPerCategory = 500;
      if (catName === 'kids') totalPerCategory = 400;

      console.log(`Generating ${totalPerCategory} items for ${catName}...`);
      for (let i = 0; i < totalPerCategory; i++) {
        allProducts.push(generateProduct(catName, adminUser._id, categoriesMap[catName], uniqueIdCounter));
        uniqueIdCounter++;
      }
    }

    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} items)...`);
    }

    console.log(`Successfully seeded ${allProducts.length} 100% UNIQUE Flipkart-style products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed2000();
