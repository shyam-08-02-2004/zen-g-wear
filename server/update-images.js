import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const productSchema = new mongoose.Schema({
  images: [{ url: String, publicId: String }]
}, { strict: false });

const Product = mongoose.model('Product', productSchema);

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('Connected to DB');
    
    const products = await Product.find({});
    let updatedCount = 0;
    
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        const url = product.images[0].url;
        if (url.includes('via.placeholder.com')) {
          const newUrl = url.replace('https://via.placeholder.com/400x500.png', 'https://placehold.co/400x500/EFEFEF/333333/png');
          product.images[0].url = newUrl;
          await product.save();
          updatedCount++;
        }
      }
    }
    console.log(`Updated ${updatedCount} products with new image URLs.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

updateImages();
