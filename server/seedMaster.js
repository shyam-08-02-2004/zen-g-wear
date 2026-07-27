import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// ═══════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════
const pSchema = new mongoose.Schema({
  name: String, slug: String, brand: String, subcategory: String,
  price: Number, discountPrice: Number, discountPercentage: Number,
  stock: Number, colors: [String], sizes: [String], description: String,
  images: [{ url: String, publicId: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  rating: Number, numReviews: Number, isNewArrival: Boolean, isActive: Boolean,
  material: String, pattern: String, fit: String, gender: String,
}, { strict: false });
const cSchema = new mongoose.Schema({ name: String, slug: String }, { strict: false });
const Product = mongoose.model('Product', pSchema);
const Category = mongoose.model('Category', cSchema);

// ═══════════════════════════════════════════════════════════════
// VARIATION POOLS
// ═══════════════════════════════════════════════════════════════
const COLORS = ['Black','White','Navy Blue','Grey','Maroon','Olive Green','Brown','Royal Blue','Red','Beige','Pink','Yellow','Orange','Cream','Purple','Wine','Mustard','Teal','Charcoal','Sky Blue','Peach','Lavender','Mint Green','Coral','Rust'];
const PATTERNS = ['Solid','Printed','Checked','Striped','Graphic','Color Block','Camouflage','Abstract','Floral','Geometric','Textured','Self Design','Embroidered','Typography','Paisley'];
const FITS = ['Slim Fit','Regular Fit','Relaxed Fit','Oversized','Tailored Fit'];

const MEN_BRANDS = ['Puma','Nike','Adidas','Roadster','HRX','Levi\'s','U.S. Polo','WROGN','Allen Solly','Peter England','Louis Philippe','Jack & Jones','H&M','Tommy Hilfiger','Arrow','Van Heusen','Mufti','Spykar','Flying Machine','Highlander','Monte Carlo','Jockey','Wildcraft','Fastrack','Fossil','Casio','Woodland','Red Tape','Bata','Campus'];
const WOMEN_BRANDS = ['Vero Moda','Forever 21','H&M','Zara','Mango','Only','FabAlley','StalkBuyLove','DressBerry','Biba','W','Libas','Anouk','Janasya','Aurelia','Enamor','Zivame','Amante','Clovia','Lavie','Baggit','Caprese','Fastrack','Titan','Catwalk','Metro','Inc.5','Lakme','Maybelline','Faces Canada'];
const KIDS_BRANDS = ['Max','Allen Solly Junior','U.S. Polo Kids','Mothercare','Gini & Jony','Ed-a-Mamma','Hopscotch','Mini Klub','Pepe Jeans Kids','Gap Kids','H&M Kids','Marks & Spencer Kids','Bata Kids','Nike Kids','Puma Kids','Adidas Kids','Disney','Marvel','Barbie','Hot Wheels'];

// ═══════════════════════════════════════════════════════════════
// IMAGE URL GENERATOR (Pollinations.ai — unique per product)
// ═══════════════════════════════════════════════════════════════
function makeImageUrl(productName, seed) {
  const prompt = `Professional ecommerce catalog photo of ${productName}, studio lighting, white background, front view, high resolution, product only, no text, no watermark, no logo, premium quality`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=800&nologo=true&seed=${seed}`;
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT GENERATOR
// ═══════════════════════════════════════════════════════════════
let globalSeed = 1000;
let globalSlugCounter = 0;

function genProducts(categoryId, gender, subcatSlug, baseItem, count, opts = {}) {
  const {
    brands = MEN_BRANDS,
    sizes = ['S','M','L','XL','XXL'],
    fabrics = ['Cotton','Polyester','Blend'],
    priceMin = 399, priceMax = 2999,
    nameTemplate = null,
  } = opts;

  const products = [];
  let idx = 0;

  for (let c = 0; c < COLORS.length && idx < count; c++) {
    for (let p = 0; p < PATTERNS.length && idx < count; p++) {
      const color = COLORS[c];
      const pattern = PATTERNS[p];
      const fit = FITS[idx % FITS.length];
      const brand = brands[idx % brands.length];
      const fabric = fabrics[idx % fabrics.length];

      const name = nameTemplate
        ? nameTemplate(color, pattern, fit)
        : `${gender} ${color} ${pattern} ${fit} ${baseItem}`;

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + (++globalSlugCounter);
      const seed = globalSeed++;
      const basePrice = Math.floor(Math.random() * (priceMax - priceMin)) + priceMin;
      const discPct = Math.floor(Math.random() * 45) + 10;
      const discPrice = Math.round(basePrice * (1 - discPct / 100));

      products.push({
        name, slug, brand,
        category: categoryId,
        subcategory: subcatSlug,
        gender: gender.split(' ')[0],
        price: basePrice,
        discountPrice: discPrice,
        discountPercentage: discPct,
        stock: Math.floor(Math.random() * 80) + 10,
        colors: [color, COLORS[(c + 3) % COLORS.length], COLORS[(c + 7) % COLORS.length]],
        sizes,
        material: fabric,
        pattern,
        fit,
        description: `Premium ${name} from ${brand}. Made with high-quality ${fabric} fabric. Features a ${pattern.toLowerCase()} design with ${fit.toLowerCase()} cut. Perfect for every occasion. Available in multiple colors and sizes.`,
        images: [{ url: makeImageUrl(name, seed), publicId: `prod_${seed}` }],
        rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 500) + 5,
        isNewArrival: Math.random() > 0.6,
        isActive: true,
      });
      idx++;
    }
  }
  return products;
}

// ═══════════════════════════════════════════════════════════════
// CATEGORY DEFINITIONS — 2000 PRODUCTS
// ═══════════════════════════════════════════════════════════════

function buildCatalog(catIds) {
  const all = [];
  const B = { m: MEN_BRANDS, w: WOMEN_BRANDS, k: KIDS_BRANDS };
  const clothSizes = ['S','M','L','XL','XXL'];
  const wClothSizes = ['XS','S','M','L','XL'];
  const kClothSizes = ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y','12-13Y'];
  const shoeSizes = ['6','7','8','9','10','11'];
  const wShoeSizes = ['3','4','5','6','7','8'];
  const kShoeSizes = ['8C','9C','10C','11C','12C','13C','1','2','3'];
  const oneSize = ['Free Size'];
  const linSizes = ['30','32','34','36','38','40'];

  // ──────────────── MEN (28 subcategories, ~780 products) ────────────────
  const M = catIds.men;
  all.push(...genProducts(M,'Men','tshirt','T-Shirt',50,{brands:B.m,fabrics:['Cotton','Polyester','Cotton Blend','Lycra','Jersey']}));
  all.push(...genProducts(M,'Men','shirt','Casual Shirt',45,{brands:B.m,fabrics:['Cotton','Linen','Denim','Oxford','Chambray']}));
  all.push(...genProducts(M,'Men','jeans','Denim Jeans',42,{brands:B.m,sizes:['28','30','32','34','36','38'],fabrics:['Denim','Stretch Denim','Raw Denim']}));
  all.push(...genProducts(M,'Men','trousers','Formal Trousers',35,{brands:B.m,sizes:['28','30','32','34','36','38'],fabrics:['Cotton','Polyester','Linen','Wool Blend']}));
  all.push(...genProducts(M,'Men','shorts','Casual Shorts',30,{brands:B.m,fabrics:['Cotton','Denim','Nylon','Polyester']}));
  all.push(...genProducts(M,'Men','trackpants','Track Pants',28,{brands:B.m,fabrics:['Polyester','Cotton Blend','Fleece']}));
  all.push(...genProducts(M,'Men','joggers','Joggers',28,{brands:B.m,fabrics:['Cotton','French Terry','Fleece']}));
  all.push(...genProducts(M,'Men','cargo','Cargo Pants',25,{brands:B.m,sizes:['28','30','32','34','36','38'],fabrics:['Cotton','Canvas','Twill']}));
  all.push(...genProducts(M,'Men','hoodie','Hoodie',35,{brands:B.m,fabrics:['Fleece','Cotton','French Terry'],priceMin:999,priceMax:3999}));
  all.push(...genProducts(M,'Men','sweatshirt','Sweatshirt',28,{brands:B.m,fabrics:['Fleece','Cotton Blend','French Terry'],priceMin:799,priceMax:3499}));
  all.push(...genProducts(M,'Men','jacket','Jacket',35,{brands:B.m,fabrics:['Polyester','Nylon','Denim','Leather','Bomber'],priceMin:1499,priceMax:5999}));
  all.push(...genProducts(M,'Men','blazer','Blazer',25,{brands:B.m,fabrics:['Polyester','Wool Blend','Linen','Tweed'],priceMin:1999,priceMax:7999}));
  all.push(...genProducts(M,'Men','ethnicwear','Ethnic Kurta',25,{brands:B.m,fabrics:['Cotton','Silk','Linen','Jacquard'],priceMin:699,priceMax:4999}));
  all.push(...genProducts(M,'Men','innerwear','Innerwear Vest',18,{brands:B.m,fabrics:['Cotton','Cotton Blend','Ribbed'],priceMin:199,priceMax:699}));
  all.push(...genProducts(M,'Men','vest','Cotton Vest',18,{brands:B.m,fabrics:['Cotton','Ribbed Cotton','Micro Modal'],priceMin:149,priceMax:599}));
  all.push(...genProducts(M,'Men','brief','Cotton Brief',18,{brands:B.m,sizes:['S','M','L','XL'],fabrics:['Cotton','Micro Modal','Bamboo'],priceMin:149,priceMax:599}));
  all.push(...genProducts(M,'Men','boxer','Boxer Shorts',18,{brands:B.m,sizes:['S','M','L','XL'],fabrics:['Cotton','Bamboo','Modal'],priceMin:199,priceMax:699}));
  all.push(...genProducts(M,'Men','socks','Ankle Socks',15,{brands:B.m,sizes:oneSize,fabrics:['Cotton','Nylon','Wool'],priceMin:99,priceMax:499}));
  all.push(...genProducts(M,'Men','belt','Leather Belt',18,{brands:B.m,sizes:['S','M','L','XL'],fabrics:['Genuine Leather','Faux Leather','Canvas'],priceMin:399,priceMax:2499,nameTemplate:(c,p,f)=>`Men ${c} ${p} ${f} Belt`}));
  all.push(...genProducts(M,'Men','wallet','Leather Wallet',18,{brands:B.m,sizes:oneSize,fabrics:['Genuine Leather','Faux Leather','Canvas'],priceMin:299,priceMax:2999,nameTemplate:(c,p,f)=>`Men ${c} ${p} Bi-Fold Wallet`}));
  all.push(...genProducts(M,'Men','cap','Baseball Cap',15,{brands:B.m,sizes:oneSize,fabrics:['Cotton','Polyester','Mesh'],priceMin:199,priceMax:999,nameTemplate:(c,p,f)=>`Men ${c} ${p} Baseball Cap`}));
  all.push(...genProducts(M,'Men','sunglasses','Sunglasses',15,{brands:B.m,sizes:oneSize,fabrics:['Metal Frame','Acetate Frame','TR90'],priceMin:499,priceMax:3999,nameTemplate:(c,p,f)=>`Men ${c} Aviator Sunglasses`}));
  all.push(...genProducts(M,'Men','watches','Analog Watch',30,{brands:B.m,sizes:oneSize,fabrics:['Stainless Steel','Leather Strap','Silicon','Metal Chain'],priceMin:999,priceMax:9999,nameTemplate:(c,p,f)=>`Men ${c} Dial ${p} Analog Watch`}));
  all.push(...genProducts(M,'Men','sportsshoes','Sports Running Shoes',35,{brands:B.m,sizes:shoeSizes,fabrics:['Mesh','Synthetic','Knit','EVA'],priceMin:999,priceMax:5999,nameTemplate:(c,p,f)=>`Men ${c} ${p} Sports Running Shoes`}));
  all.push(...genProducts(M,'Men','casualshoes','Casual Sneakers',30,{brands:B.m,sizes:shoeSizes,fabrics:['Canvas','Leather','Synthetic','Suede'],priceMin:799,priceMax:4999,nameTemplate:(c,p,f)=>`Men ${c} ${p} Casual Sneakers`}));
  all.push(...genProducts(M,'Men','formalshoes','Formal Derby Shoes',22,{brands:B.m,sizes:shoeSizes,fabrics:['Genuine Leather','Patent Leather','Suede'],priceMin:1499,priceMax:6999,nameTemplate:(c,p,f)=>`Men ${c} Formal Derby Shoes`}));
  all.push(...genProducts(M,'Men','sandals','Comfort Sandals',15,{brands:B.m,sizes:shoeSizes,fabrics:['Leather','Synthetic','EVA'],priceMin:399,priceMax:2499,nameTemplate:(c,p,f)=>`Men ${c} Comfort Sandals`}));
  all.push(...genProducts(M,'Men','slippers','Flip Flops',15,{brands:B.m,sizes:shoeSizes,fabrics:['Rubber','EVA','PU'],priceMin:199,priceMax:999,nameTemplate:(c,p,f)=>`Men ${c} ${p} Flip Flops`}));

  // ──────────────── WOMEN (33 subcategories, ~850 products) ────────────────
  const W = catIds.women;
  all.push(...genProducts(W,'Women','dress','Maxi Dress',45,{brands:B.w,sizes:wClothSizes,fabrics:['Georgette','Crepe','Cotton','Chiffon','Satin'],priceMin:699,priceMax:4999}));
  all.push(...genProducts(W,'Women','top','Casual Top',42,{brands:B.w,sizes:wClothSizes,fabrics:['Rayon','Cotton','Crepe','Georgette','Polyester']}));
  all.push(...genProducts(W,'Women','tshirt','Round Neck T-Shirt',38,{brands:B.w,sizes:wClothSizes,fabrics:['Cotton','Polyester','Lycra','Jersey']}));
  all.push(...genProducts(W,'Women','shirt','Western Shirt',28,{brands:B.w,sizes:wClothSizes,fabrics:['Cotton','Denim','Linen','Rayon']}));
  all.push(...genProducts(W,'Women','jeans','Skinny Jeans',38,{brands:B.w,sizes:linSizes,fabrics:['Denim','Stretch Denim','Lycra Denim']}));
  all.push(...genProducts(W,'Women','trousers','Formal Trousers',22,{brands:B.w,sizes:linSizes,fabrics:['Cotton','Polyester','Linen']}));
  all.push(...genProducts(W,'Women','leggings','Ankle Leggings',22,{brands:B.w,sizes:wClothSizes,fabrics:['Cotton Lycra','Viscose','Spandex'],priceMin:249,priceMax:999}));
  all.push(...genProducts(W,'Women','palazzo','Palazzo Pants',22,{brands:B.w,sizes:wClothSizes,fabrics:['Rayon','Cotton','Crepe','Georgette'],priceMin:349,priceMax:1499}));
  all.push(...genProducts(W,'Women','skirt','A-Line Skirt',25,{brands:B.w,sizes:wClothSizes,fabrics:['Denim','Cotton','Polyester','Satin'],priceMin:499,priceMax:2499}));
  all.push(...genProducts(W,'Women','kurti','Straight Kurti',42,{brands:B.w,sizes:wClothSizes,fabrics:['Cotton','Rayon','Silk','Chanderi','Viscose'],priceMin:399,priceMax:2999}));
  all.push(...genProducts(W,'Women','kurta','Anarkali Kurta',32,{brands:B.w,sizes:wClothSizes,fabrics:['Cotton','Rayon','Silk Blend','Georgette'],priceMin:599,priceMax:3999}));
  all.push(...genProducts(W,'Women','saree','Designer Saree',38,{brands:B.w,sizes:oneSize,fabrics:['Silk','Chiffon','Georgette','Banarasi','Cotton','Net'],priceMin:999,priceMax:9999}));
  all.push(...genProducts(W,'Women','lehenga','Bridal Lehenga',25,{brands:B.w,sizes:wClothSizes,fabrics:['Silk','Net','Velvet','Georgette','Satin'],priceMin:2999,priceMax:14999}));
  all.push(...genProducts(W,'Women','ethnicwear','Ethnic Suit Set',22,{brands:B.w,sizes:wClothSizes,fabrics:['Cotton','Rayon','Silk','Chanderi'],priceMin:799,priceMax:4999}));
  all.push(...genProducts(W,'Women','nightwear','Night Suit',18,{brands:B.w,sizes:wClothSizes,fabrics:['Cotton','Satin','Hosiery'],priceMin:399,priceMax:1999}));
  all.push(...genProducts(W,'Women','lingerie','Lingerie Set',15,{brands:B.w,sizes:linSizes,fabrics:['Lace','Nylon','Satin','Cotton'],priceMin:399,priceMax:2499}));
  all.push(...genProducts(W,'Women','bra','Padded Bra',28,{brands:B.w,sizes:linSizes,fabrics:['Cotton','Lace','Nylon','Microfiber'],priceMin:299,priceMax:1499,nameTemplate:(c,p,f)=>`Women ${c} ${p} Padded Bra`}));
  all.push(...genProducts(W,'Women','panty','Hipster Panty',22,{brands:B.w,sizes:wClothSizes,fabrics:['Cotton','Lace','Nylon','Micro Modal'],priceMin:149,priceMax:699,nameTemplate:(c,p,f)=>`Women ${c} ${p} Hipster Panty`}));
  all.push(...genProducts(W,'Women','sportsbra','Sports Bra',18,{brands:B.w,sizes:wClothSizes,fabrics:['Nylon','Spandex','Polyester Blend'],priceMin:399,priceMax:1999,nameTemplate:(c,p,f)=>`Women ${c} ${p} High Support Sports Bra`}));
  all.push(...genProducts(W,'Women','shapewear','Body Shapewear',12,{brands:B.w,sizes:wClothSizes,fabrics:['Nylon','Spandex','Lycra'],priceMin:499,priceMax:2499,nameTemplate:(c,p,f)=>`Women ${c} ${f} Body Shaper`}));
  all.push(...genProducts(W,'Women','hoodie','Hoodie',20,{brands:B.w,sizes:wClothSizes,fabrics:['Fleece','Cotton','French Terry'],priceMin:799,priceMax:3499}));
  all.push(...genProducts(W,'Women','sweatshirt','Sweatshirt',18,{brands:B.w,sizes:wClothSizes,fabrics:['Fleece','Cotton Blend','French Terry'],priceMin:699,priceMax:2999}));
  all.push(...genProducts(W,'Women','jacket','Puffer Jacket',25,{brands:B.w,sizes:wClothSizes,fabrics:['Polyester','Nylon','Denim','Faux Leather'],priceMin:1299,priceMax:5999}));
  all.push(...genProducts(W,'Women','handbag','Tote Handbag',28,{brands:B.w,sizes:oneSize,fabrics:['Faux Leather','Genuine Leather','Canvas','PU'],priceMin:699,priceMax:4999,nameTemplate:(c,p,f)=>`Women ${c} ${p} Tote Handbag`}));
  all.push(...genProducts(W,'Women','wallet','Zip-Around Wallet',15,{brands:B.w,sizes:oneSize,fabrics:['Faux Leather','Genuine Leather','PU'],priceMin:299,priceMax:2499,nameTemplate:(c,p,f)=>`Women ${c} ${p} Zip-Around Wallet`}));
  all.push(...genProducts(W,'Women','jewellery','Statement Necklace',22,{brands:B.w,sizes:oneSize,fabrics:['Gold Plated','Silver Plated','Oxidized','Kundan'],priceMin:199,priceMax:2999,nameTemplate:(c,p,f)=>`Women ${c} ${p} ${f} Statement Necklace`}));
  all.push(...genProducts(W,'Women','watches','Analog Watch',22,{brands:B.w,sizes:oneSize,fabrics:['Stainless Steel','Leather Strap','Bracelet','Ceramic'],priceMin:999,priceMax:7999,nameTemplate:(c,p,f)=>`Women ${c} Dial Elegant Analog Watch`}));
  all.push(...genProducts(W,'Women','sandals','Flat Sandals',20,{brands:B.w,sizes:wShoeSizes,fabrics:['Faux Leather','PU','Synthetic'],priceMin:399,priceMax:2499,nameTemplate:(c,p,f)=>`Women ${c} ${p} Flat Sandals`}));
  all.push(...genProducts(W,'Women','heels','Block Heels',25,{brands:B.w,sizes:wShoeSizes,fabrics:['Faux Leather','Patent','Suede','PU'],priceMin:699,priceMax:3999,nameTemplate:(c,p,f)=>`Women ${c} ${p} Block Heels`}));
  all.push(...genProducts(W,'Women','flats','Ballet Flats',15,{brands:B.w,sizes:wShoeSizes,fabrics:['Faux Leather','PU','Canvas'],priceMin:399,priceMax:1999,nameTemplate:(c,p,f)=>`Women ${c} ${p} Ballet Flats`}));
  all.push(...genProducts(W,'Women','sneakers','Casual Sneakers',20,{brands:B.w,sizes:wShoeSizes,fabrics:['Canvas','Mesh','Synthetic','Knit'],priceMin:799,priceMax:3999,nameTemplate:(c,p,f)=>`Women ${c} ${p} Casual Sneakers`}));
  all.push(...genProducts(W,'Women','beauty','Beauty Essentials Kit',15,{brands:B.w,sizes:oneSize,fabrics:['Matte Finish','Glossy','Cream','Powder'],priceMin:199,priceMax:2999,nameTemplate:(c,p,f)=>`Women ${c} Shade ${f} Beauty Kit`}));
  all.push(...genProducts(W,'Women','accessories','Fashion Scarf',15,{brands:B.w,sizes:oneSize,fabrics:['Silk','Chiffon','Cotton','Wool'],priceMin:199,priceMax:1499,nameTemplate:(c,p,f)=>`Women ${c} ${p} Fashion Scarf`}));

  // ──────────────── KIDS (19 subcategories, ~450 products) ────────────────
  const K = catIds.kids;
  all.push(...genProducts(K,'Kids','boysclothing','Boys Casual Outfit Set',35,{brands:B.k,sizes:kClothSizes,fabrics:['Cotton','Cotton Blend','Polyester'],priceMin:399,priceMax:1999}));
  all.push(...genProducts(K,'Kids','girlsclothing','Girls Party Wear Set',35,{brands:B.k,sizes:kClothSizes,fabrics:['Cotton','Rayon','Net','Georgette'],priceMin:499,priceMax:2499}));
  all.push(...genProducts(K,'Kids','babyclothing','Baby Romper',25,{brands:B.k,sizes:['0-3M','3-6M','6-9M','9-12M','12-18M'],fabrics:['Cotton','Organic Cotton','Muslin'],priceMin:249,priceMax:999}));
  all.push(...genProducts(K,'Kids','tshirt','Round Neck T-Shirt',38,{brands:B.k,sizes:kClothSizes,fabrics:['Cotton','Polyester','Jersey']}));
  all.push(...genProducts(K,'Kids','shirt','Casual Shirt',25,{brands:B.k,sizes:kClothSizes,fabrics:['Cotton','Linen','Denim']}));
  all.push(...genProducts(K,'Kids','jeans','Denim Jeans',28,{brands:B.k,sizes:kClothSizes,fabrics:['Denim','Stretch Denim']}));
  all.push(...genProducts(K,'Kids','shorts','Casual Shorts',25,{brands:B.k,sizes:kClothSizes,fabrics:['Cotton','Denim','Nylon']}));
  all.push(...genProducts(K,'Kids','frock','Party Wear Frock',28,{brands:B.k,sizes:kClothSizes,fabrics:['Cotton','Net','Georgette','Satin'],priceMin:499,priceMax:2999}));
  all.push(...genProducts(K,'Kids','dress','Casual Dress',25,{brands:B.k,sizes:kClothSizes,fabrics:['Cotton','Rayon','Crepe'],priceMin:399,priceMax:1999}));
  all.push(...genProducts(K,'Kids','schooluniform','School Uniform Set',15,{brands:B.k,sizes:kClothSizes,fabrics:['Cotton','Poly-Cotton','Terry Cotton'],priceMin:499,priceMax:1499,nameTemplate:(c,p,f)=>`Kids ${c} School Uniform ${f} Set`}));
  all.push(...genProducts(K,'Kids','winterwear','Winter Jacket',25,{brands:B.k,sizes:kClothSizes,fabrics:['Fleece','Nylon','Polyester','Wool Blend'],priceMin:699,priceMax:3499}));
  all.push(...genProducts(K,'Kids','shoes','Sports Shoes',30,{brands:B.k,sizes:kShoeSizes,fabrics:['Mesh','Synthetic','PU','EVA'],priceMin:499,priceMax:2999,nameTemplate:(c,p,f)=>`Kids ${c} ${p} Sports Shoes`}));
  all.push(...genProducts(K,'Kids','sandals','Velcro Sandals',18,{brands:B.k,sizes:kShoeSizes,fabrics:['PU','EVA','Synthetic'],priceMin:299,priceMax:1499,nameTemplate:(c,p,f)=>`Kids ${c} ${p} Velcro Sandals`}));
  all.push(...genProducts(K,'Kids','cap','Cotton Cap',15,{brands:B.k,sizes:oneSize,fabrics:['Cotton','Polyester','Mesh'],priceMin:149,priceMax:699,nameTemplate:(c,p,f)=>`Kids ${c} ${p} Cotton Cap`}));
  all.push(...genProducts(K,'Kids','schoolbag','School Backpack',20,{brands:B.k,sizes:oneSize,fabrics:['Polyester','Nylon','Canvas'],priceMin:499,priceMax:2499,nameTemplate:(c,p,f)=>`Kids ${c} ${p} School Backpack`}));
  all.push(...genProducts(K,'Kids','watches','Digital Watch',15,{brands:B.k,sizes:oneSize,fabrics:['Plastic','Silicon','Rubber'],priceMin:299,priceMax:1999,nameTemplate:(c,p,f)=>`Kids ${c} ${p} Digital Watch`}));
  all.push(...genProducts(K,'Kids','toys','Educational Toy Set',20,{brands:B.k,sizes:oneSize,fabrics:['Plastic','Wood','Fabric'],priceMin:199,priceMax:1999,nameTemplate:(c,p,f)=>`Kids ${c} ${p} Educational Toy Set`}));
  all.push(...genProducts(K,'Kids','babycare','Baby Care Essentials',12,{brands:B.k,sizes:oneSize,fabrics:['Organic','Natural','Herbal'],priceMin:149,priceMax:999,nameTemplate:(c,p,f)=>`Kids ${c} ${f} Baby Care Kit`}));
  all.push(...genProducts(K,'Kids','accessories','Fashion Accessory Set',12,{brands:B.k,sizes:oneSize,fabrics:['Metal','Plastic','Fabric'],priceMin:99,priceMax:799,nameTemplate:(c,p,f)=>`Kids ${c} ${p} Fashion Accessory Set`}));

  return all;
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════
async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('✅ Connected to MongoDB');

    // Wipe old data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🧹 Cleared old products and categories');

    // Create categories
    const menCat = await Category.create({ name: 'men', slug: 'men' });
    const womenCat = await Category.create({ name: 'women', slug: 'women' });
    const kidsCat = await Category.create({ name: 'kids', slug: 'kids' });
    console.log('📂 Created categories: Men, Women, Kids');

    // Generate all products
    const allProducts = buildCatalog({
      men: menCat._id,
      women: womenCat._id,
      kids: kidsCat._id,
    });

    console.log(`📦 Generated ${allProducts.length} products. Inserting into database...`);

    // Bulk insert in batches of 200
    const BATCH = 200;
    for (let i = 0; i < allProducts.length; i += BATCH) {
      const batch = allProducts.slice(i, i + BATCH);
      await Product.insertMany(batch, { ordered: false });
      console.log(`  ⏳ Inserted ${Math.min(i + BATCH, allProducts.length)}/${allProducts.length}`);
    }

    console.log(`\n🎉 SUCCESS! ${allProducts.length} premium products seeded!`);
    console.log(`   Men: ${allProducts.filter(p => p.gender === 'Men').length}`);
    console.log(`   Women: ${allProducts.filter(p => p.gender === 'Women').length}`);
    console.log(`   Kids: ${allProducts.filter(p => p.gender === 'Kids').length}`);

    // Verify subcategories
    const subcats = [...new Set(allProducts.map(p => `${p.gender}|${p.subcategory}`))];
    console.log(`   Unique subcategories: ${subcats.length}`);
    console.log(`   All images unique: ${new Set(allProducts.map(p => p.images[0].url)).size === allProducts.length ? 'YES ✅' : 'NO ❌'}`);

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

run();
