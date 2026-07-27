import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const imageMap = {
  watches: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80', 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'],
  shoes: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80'],
  tshirt: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'],
  shirt: ['https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=800&q=80', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80'],
  jeans: ['https://images.unsplash.com/photo-1542272604-780c406839d3?w=800&q=80', 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=800&q=80'],
  shorts: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80'],
  lower: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'],
  undergarments: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
  perfumes: ['https://images.unsplash.com/photo-1523293115678-d29062095983?w=800&q=80'],
  glasses: ['https://images.unsplash.com/photo-1572635196237-14b3f281501f?w=800&q=80']
};

const defaultImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80';

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    console.log('MongoDB Connected');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;

    for (const product of products) {
      const subCat = product.subcategory || '';
      let chosenImages = [];
      
      if (imageMap[subCat] && imageMap[subCat].length > 0) {
        // Pick a random image from the category's mapped images
        const randImage = imageMap[subCat][Math.floor(Math.random() * imageMap[subCat].length)];
        chosenImages = [{ url: randImage, altText: product.name }];
      } else {
        chosenImages = [{ url: defaultImage, altText: product.name }];
      }

      await Product.updateOne({ _id: product._id }, { $set: { images: chosenImages } });
      updatedCount++;
    }

    console.log(`Successfully updated images for ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing images:', error);
    process.exit(1);
  }
};

fixImages();
