import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const pSchema = new mongoose.Schema({
  images: [{ url: String, publicId: String }],
  subcategory: String,
  gender: String
}, { strict: false });
const Product = mongoose.model('Product', pSchema);

// ═══════════════════════════════════════════════════════════════
// PREMIUM UNSPLASH IMAGE POOLS (Lightning Fast & Reliable)
// ═══════════════════════════════════════════════════════════════

const IMG = {
  Men: {
    tshirt: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'
    ],
    shirt: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
      'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80',
      'https://images.unsplash.com/photo-1512327536842-5aa37d1ba3e3?w=600&q=80'
    ],
    jeans: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80'
    ],
    trackpants: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80','https://images.unsplash.com/photo-1515562141207-7a8efd38407b?w=600&q=80'],
    shorts: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80','https://images.unsplash.com/photo-1553531384-411a247ccd73?w=600&q=80'],
    jacket: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'],
    hoodie: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80','https://images.unsplash.com/photo-1578587018452-892bace94f12?w=600&q=80'],
    sportsshoes: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'],
    watches: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80','https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80'],
    innerwear: ['https://images.unsplash.com/photo-15dd5700877549-30c33d8339ab?w=600&q=80'],
    default: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80','https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=600&q=80']
  },
  Women: {
    dress: [
      'https://images.unsplash.com/photo-1572804013309-82a89b4f4699?w=600&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80'
    ],
    kurti: [
      'https://images.unsplash.com/photo-1583391733958-d15314714f5f?w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80'
    ],
    top: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&q=80'
    ],
    jeans: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80'
    ],
    saree: ['https://images.unsplash.com/photo-1610030469983-98e550d61dc0?w=600&q=80','https://images.unsplash.com/photo-1583391733958-d15314714f5f?w=600&q=80'],
    handbag: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80','https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80'],
    heels: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80','https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80'],
    bra: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80','https://images.unsplash.com/photo-1588096350320-72f1225fb843?w=600&q=80'],
    jewellery: ['https://images.unsplash.com/photo-1599643478514-4a884f18ee08?w=600&q=80','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80'],
    default: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80']
  },
  Kids: {
    tshirt: ['https://images.unsplash.com/photo-1519238382902-6019318b76c8?w=600&q=80','https://images.unsplash.com/photo-1519276412152-f6746de552a4?w=600&q=80'],
    dress: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80','https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&q=80'],
    babyclothing: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80','https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80'],
    shoes: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80'],
    toys: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80'],
    default: ['https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&q=80','https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80']
  }
};

async function patch() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('✅ Connected. Patching images...');
    
    const products = await Product.find({});
    
    let updated = 0;
    for (let p of products) {
      const g = p.gender;
      const sub = p.subcategory;
      
      let pool = null;
      if (IMG[g]) {
        if (IMG[g][sub] && IMG[g][sub].length > 0) {
          pool = IMG[g][sub];
        } else {
          pool = IMG[g].default;
        }
      } else {
        pool = IMG.Men.default; // Fallback
      }
      
      const newUrl = pool[Math.floor(Math.random() * pool.length)];
      
      if (p.images && p.images[0]) {
        p.images[0].url = newUrl;
      } else {
        p.images = [{ url: newUrl, publicId: `patched_${Date.now()}` }];
      }
      
      await p.save();
      updated++;
    }
    
    console.log(`✅ Patched ${updated} products with lightning-fast Unsplash images.`);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

patch();
