import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const categorySchema = new mongoose.Schema({
  name: String
}, { strict: false });

const productSchema = new mongoose.Schema({
  images: [{ url: String, publicId: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { strict: false });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

const menImages = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507680434267-dbd304059224?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80'
];

const womenImages = [
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=400&q=80'
];

const kidsImages = [
  'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1471286174890-9c1122606886?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=400&q=80'
];

function getRandomImage(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('Connected to DB');
    
    const products = await Product.find({}).populate('category');
    let updatedCount = 0;
    
    for (const product of products) {
      if (!product.category) continue;
      
      const catName = product.category.name.toLowerCase();
      let imageUrl = '';
      
      if (catName.includes('men') && !catName.includes('women')) {
        imageUrl = getRandomImage(menImages);
      } else if (catName.includes('women')) {
        imageUrl = getRandomImage(womenImages);
      } else if (catName.includes('kid')) {
        imageUrl = getRandomImage(kidsImages);
      } else {
        imageUrl = getRandomImage(menImages); // fallback
      }
      
      product.images = [{
        url: imageUrl,
        publicId: 'unsplash_' + Date.now()
      }];
      
      await product.save();
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} products with realistic Unsplash images.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

updateImages();
