import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const pSchema = new mongoose.Schema({name:String,subcategory:String,images:[{url:String,publicId:String}],category:{type:mongoose.Schema.Types.ObjectId,ref:'Category'}},{strict:false});
const cSchema = new mongoose.Schema({name:String},{strict:false});
const Product = mongoose.model('Product',pSchema);
const Category = mongoose.model('Category',cSchema);

await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/zen-g-wear');
const products = await Product.find({}).populate('category').select('name subcategory category').lean();

const groups = {};
for(const p of products){
  const catName = p.category?.name||'Unknown';
  const sub = p.subcategory||'none';
  const key = `${catName}|${sub}`;
  if(!groups[key]) groups[key]={count:0,examples:[]};
  groups[key].count++;
  if(groups[key].examples.length<4) groups[key].examples.push(p.name);
}
for(const [key,val] of Object.entries(groups)){
  console.log(`\n[${key}] — ${val.count} products`);
  val.examples.forEach(e=>console.log('  '+e));
}
process.exit(0);
