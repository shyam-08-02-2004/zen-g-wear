import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const pSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategory: String,
  images: [{ url: String, publicId: String }]
}, { strict: false });
const Product = mongoose.model('Product', pSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({}).lean();
    console.log(`📦 ${products.length} products found. Updating with 100% Unique AI-generated Image URLs...`);

    let updated = 0;

    for (const product of products) {
      // Create a highly specific AI prompt based on exactly the product's name
      // The user wants Flipkart/Myntra style studio photography.
      const prompt = `Ultra HD premium ecommerce studio photography of ${product.name}, white background, front view, no text, no logo, product only`;
      
      // We use a unique seed based on the product ID so the image is stable but 100% unique across all products
      const seed = parseInt(product._id.toString().slice(-6), 16); 
      
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=500&nologo=true&seed=${seed}`;

      await Product.updateOne(
        { _id: product._id },
        { $set: { images: [{ url: imageUrl, publicId: `ai_img_${product._id}` }] } }
      );
      
      updated++;
      if (updated % 200 === 0) console.log(`  ⏳ ${updated}/${products.length} updated...`);
    }

    console.log(`\n✅ Done! Successfully assigned 100% Unique AI dynamic images to all ${updated} products.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

run();
