import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const pSchema = new mongoose.Schema({
  name: String,
  images: [{ url: String, publicId: String }]
}, { strict: false });
const Product = mongoose.model('Product', pSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
  
  const products = await Product.find({}).limit(5).lean();
  for (const p of products) {
    const prompt = `Premium eCommerce studio photography of ${p.name}, white background, front view, high resolution, product only`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=500&nologo=true`;
    console.log(`Product: ${p.name}`);
    console.log(`URL: ${url}\n`);
  }
  process.exit(0);
}
run();
