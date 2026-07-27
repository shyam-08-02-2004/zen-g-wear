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

// Data pools mapped directly by Item Type
const catalogs = {
  men: {
    brands: ['PUMA', 'LEVIS', 'WRANGLER', 'TOMMY HILFIGER', 'CALVIN KLEIN', 'ZARA MAN', 'H&M', 'JACK & JONES', 'ALLEN SOLLY'],
    items: [
      {
        type: 'T-Shirt',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Shirt',
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1588359348348-972322617f69?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Jeans',
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1604198453349-05244583196c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1584328627382-9ed324545300?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Jacket',
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800'
        ]
      }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  women: {
    brands: ['ZARA', 'H&M', 'MANGO', 'ONLY', 'VERO MODA', 'FOREVER 21', 'BIBA', 'W FOR WOMAN'],
    items: [
      {
        type: 'Dress',
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1515347619362-e64e9a38f36c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Top',
        images: [
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Jeans',
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800'
        ]
      }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  kids: {
    brands: ['GAP KIDS', 'MOTHERCARE', 'UNITED COLORS OF BENETTON', 'H&M KIDS', 'MAX'],
    items: [
      {
        type: 'T-Shirt',
        images: [
          'https://images.unsplash.com/photo-1519238263530-99abd11d0a38?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Dress',
        images: [
          'https://images.unsplash.com/photo-1514090289043-f661849a64bc?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=800'
        ]
      }
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y']
  },
  shoes: {
    brands: ['NIKE', 'ADIDAS', 'PUMA', 'CONVERSE', 'VANS', 'REEBOK', 'NEW BALANCE', 'ASICS'],
    items: [
      {
        type: 'Sneakers',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Canvas Shoes',
        images: [
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800'
        ]
      }
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
  },
  accessories: {
    brands: ['FASTRACK', 'FOSSIL', 'CASIO', 'CAPRESE', 'LAVIE', 'TITAN', 'RAY-BAN'],
    items: [
      {
        type: 'Watch',
        images: [
          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Bag',
        images: [
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        type: 'Sunglasses',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1572635196237-14b3f281501f?auto=format&fit=crop&q=80&w=800'
        ]
      }
    ],
    sizes: ['One Size']
  }
};

const adjectives = ['Premium', 'Classic', 'Modern', 'Vintage', 'Elegant', 'Casual', 'Urban', 'Stylish', 'Comfort', 'Essential', 'Trendy', 'Luxury', 'Slim Fit', 'Regular Fit', 'Oversized'];
const colorsPool = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Grey', 'Brown', 'Navy', 'Pink'];
const categoryImages = {
  men: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
  women: 'https://images.unsplash.com/photo-1434389670869-c4db2334084f?auto=format&fit=crop&q=80&w=800',
  kids: 'https://images.unsplash.com/photo-1471286174890-9c1122cd79fc?auto=format&fit=crop&q=80&w=800',
  shoes: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800',
  accessories: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
};

const generateProduct = (categoryName, adminUserId, categoryId) => {
  const catData = catalogs[categoryName];
  const brand = getRandomItem(catData.brands);
  const adjective = getRandomItem(adjectives);
  
  // Pick an exact item type (e.g. Jeans) and its matching image array
  const itemObj = getRandomItem(catData.items);
  const type = itemObj.type;
  const image = getRandomItem(itemObj.images);
  
  const color = getRandomItem(colorsPool);
  const name = `${brand} Men ${adjective} ${type}`; // Wait, categoryName helps here
  
  let genderPrefix = '';
  if (categoryName === 'men') genderPrefix = 'Men ';
  if (categoryName === 'women') genderPrefix = 'Women ';
  if (categoryName === 'kids') genderPrefix = 'Kids ';
  
  const finalName = `${brand} ${genderPrefix}${adjective} ${type}`;
  
  const basePrice = getRandomInt(5, 50) * 100; // 500 to 5000
  const discountPercentage = getRandomInt(10, 60);
  const discountPrice = Math.floor(basePrice * (1 - discountPercentage / 100));
  
  const selectedColors = Array.from(new Set([color, getRandomItem(colorsPool)])).slice(0, 2);
  const selectedSizes = catData.sizes;
  
  const slug = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 6);

  return {
    name: finalName,
    slug,
    description: `<p>Discover the perfect blend of style and comfort with this ${adjective.toLowerCase()} ${type.toLowerCase()} by ${brand}. Crafted with high-quality materials to ensure durability and an excellent fit. An essential addition to your collection.</p>`,
    price: basePrice,
    discountPrice,
    discountPercentage,
    category: categoryId,
    brand,
    material: 'Premium Material',
    sizes: selectedSizes,
    colors: selectedColors,
    stock: getRandomInt(10, 200),
    images: [{ url: image, publicId: `img_${Math.random().toString(36).substr(2, 6)}` }],
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    numReviews: getRandomInt(5, 500),
    isFeatured: Math.random() > 0.8,
    isTrending: Math.random() > 0.8,
    isBestSeller: Math.random() > 0.9,
    isNewArrival: Math.random() > 0.8,
    createdBy: adminUserId,
    sku: generateSKU()
  };
};

const seedPrecise = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('Admin user not found!');
      process.exit(1);
    }

    // Clear existing
    await Product.deleteMany();
    console.log('Cleared existing products');

    // Create or fetch categories
    const categoriesMap = {};
    for (const catName of Object.keys(catalogs)) {
      let cat = await Category.findOne({ slug: catName });
      if (!cat) {
        cat = await Category.create({
          name: catName.charAt(0).toUpperCase() + catName.slice(1),
          slug: catName,
          description: `Shop the best in ${catName}`,
          image: categoryImages[catName]
        });
      }
      categoriesMap[catName] = cat._id;
    }

    const totalPerCategory = 200; // 200 * 5 = 1000 products
    const allProducts = [];

    for (const catName of Object.keys(catalogs)) {
      console.log(`Generating ${totalPerCategory} exact-matched items for ${catName}...`);
      for (let i = 0; i < totalPerCategory; i++) {
        allProducts.push(generateProduct(catName, adminUser._id, categoriesMap[catName]));
      }
    }

    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} items)...`);
    }

    console.log(`Successfully seeded ${allProducts.length} precise realistic products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedPrecise();
