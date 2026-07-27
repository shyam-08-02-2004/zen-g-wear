import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Category from './models/Category.js';

dotenv.config();

const subcategories = ['tshirt', 'lower', 'undergarments', 'shorts', 'jeans', 'shirt'];
const mainCats = ['men', 'women', 'kids'];

// Use loremflickr for 100% unique images that match exactly what the product is.
// E.g., https://loremflickr.com/600/800/tshirt,men?lock=1
const getDynamicImage = (catSlug, subCat, index) => {
  const keywordStr = `${subCat},${catSlug}`;
  return `https://loremflickr.com/600/800/${keywordStr}?lock=${index}`;
};

const generateProduct = (catSlug, catId, subCat, index, createdBy) => {
  let subcatName = subCat;
  let namePrefix = `${catSlug.charAt(0).toUpperCase() + catSlug.slice(1)}'s`;

  // Format subcat for display
  const subDisplay = subcatName === 'undergarments' ? 'Innerwear' : 
                     subcatName === 'tshirt' ? 'T-Shirt' : 
                     subcatName.charAt(0).toUpperCase() + subcatName.slice(1);

  const price = Math.floor(Math.random() * 2000) + 500;
  const discount = Math.floor(price * (Math.random() * 0.4 + 0.1)); // 10-50% off

  // Sizes logic
  let sizes = ['S', 'M', 'L', 'XL', 'XXL']; // Default for clothing
  if (subcatName === 'shoes') {
    sizes = ['6', '7', '8', '9', '10', '11'];
  } else if (subcatName === 'watches') {
    sizes = ['Free Size'];
  }

  // Unique image URL
  // We use `Date.now() + index` or simply a combination of cat, sub, index for the lock to ensure uniqueness.
  // LoremFlickr's lock param guarantees a fixed image for that number, but we want 1000 unique ones.
  // Using an index offset based on category to ensure lock numbers don't overlap.
  let lockOffset = 0;
  if (catSlug === 'women') lockOffset = 1000;
  if (catSlug === 'kids') lockOffset = 2000;
  const lockId = lockOffset + index + (subCat.length * 10);
  
  const imgUrl = getDynamicImage(catSlug, subCat, lockId);

  // All colors for variation
  const allColors = ['Black', 'White', 'Grey', 'Navy', 'Red', 'Blue', 'Green', 'Yellow'];
  // Pick 3 random colors
  const colors = allColors.sort(() => 0.5 - Math.random()).slice(0, 3);

  return {
    name: `${namePrefix} ${subDisplay} V${index}`,
    slug: `product-${catSlug}-${subcatName}-${index}-${Date.now()}`,
    description: `High quality ${subDisplay} for everyday use. Designed for comfort and style.`,
    price: price,
    discountPrice: price - discount,
    discountPercentage: Math.round((discount / price) * 100),
    stock: Math.floor(Math.random() * 100) + 1,
    sizes: sizes,
    colors: colors,
    images: [{ url: imgUrl, publicId: `img_${Date.now()}_${index}` }],
    category: catId,
    subcategory: subcatName, // matches what the filter expects
    brand: 'Zen-G',
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    numReviews: Math.floor(Math.random() * 500),
    createdBy,
    isActive: true,
  };
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Massive Seeding with Unique Images...');

    await Product.deleteMany();
    console.log('Cleared existing products.');

    const adminUser = await User.findOne({ role: 'admin' });
    const createdBy = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

    const dbCats = await Category.find();
    const catMap = {};
    dbCats.forEach(c => catMap[c.slug] = c._id);

    const allProducts = [];

    // Men, Women, Kids
    for (const cat of mainCats) {
      const catId = catMap[cat];
      if (!catId) {
        console.log(`Missing category in DB: ${cat}`);
        continue;
      }
      
      // 1. Regular subcategories (T-shirt, etc.) - 50 each
      for (const sub of subcategories) {
        for (let i = 1; i <= 50; i++) {
          allProducts.push(generateProduct(cat, catId, sub, i, createdBy));
        }
      }
      
      // 2. Add 100 shoes for each main category
      for (let i = 1; i <= 100; i++) {
        allProducts.push(generateProduct(cat, catId, 'shoes', i, createdBy));
      }
      
      // 3. Add 100 watches (Only for Men and Women, Kids watches are optional but we'll skip kids watches as user said men/women)
      if (cat === 'men' || cat === 'women') {
        for (let i = 1; i <= 100; i++) {
          allProducts.push(generateProduct(cat, catId, 'watches', i, createdBy));
        }
      }
    }

    console.log(`Generated ${allProducts.length} products. Inserting...`);
    
    // Insert in batches of 200 to avoid out-of-memory errors
    const batchSize = 200;
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${i/batchSize + 1}`);
    }

    console.log('Massive seeding with unique images complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
