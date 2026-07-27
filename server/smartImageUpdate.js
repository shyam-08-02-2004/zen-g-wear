import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const productSchema = new mongoose.Schema({
  name: String, subcategory: String,
  images: [{ url: String, publicId: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { strict: false });
const categorySchema = new mongoose.Schema({ name: String }, { strict: false });
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

// =============================================================
// COLOR-AWARE IMAGE POOLS — organized by garment type + color
// Each URL is a unique Unsplash photo carefully selected
// =============================================================

// -------- MEN T-SHIRTS --------
const MEN_TSHIRT = {
  white:    ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
  black:    ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'],
  navy:     ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80','https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80'],
  blue:     ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80','https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
  grey:     ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80','https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=600&q=80'],
  red:      ['https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80','https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?w=600&q=80'],
  green:    ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80','https://images.unsplash.com/photo-1580974928064-f0aeef70895a?w=600&q=80'],
  yellow:   ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80','https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'],
  graphic:  ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80','https://images.unsplash.com/photo-1490551620978-83ef7e01cf43?w=600&q=80','https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80'],
  printed:  ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'],
  polo:     ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80','https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'],
  oversized:['https://images.unsplash.com/photo-1529391409740-59f2cea08bc5?w=600&q=80','https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80','https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80','https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80','https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80','https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80','https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80','https://images.unsplash.com/photo-1490551620978-83ef7e01cf43?w=600&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80','https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80','https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=600&q=80'],
};

// -------- MEN SHIRTS --------
const MEN_SHIRT = {
  casual:   ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80','https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80'],
  formal:   ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80','https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=600&q=80'],
  checked:  ['https://images.unsplash.com/photo-1512327536842-5aa37d1ba3e3?w=600&q=80','https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80'],
  striped:  ['https://images.unsplash.com/photo-1619134778706-7015533a6150?w=600&q=80','https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80'],
  denim:    ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80','https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'],
  linen:    ['https://images.unsplash.com/photo-1578578010898-2ea1aabc3c11?w=600&q=80','https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80'],
  oxford:   ['https://images.unsplash.com/photo-1519338381761-c7523edc1f46?w=600&q=80','https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=600&q=80'],
  floral:   ['https://images.unsplash.com/photo-1620963906748-5d2f5c69efde?w=600&q=80','https://images.unsplash.com/photo-1645789644649-f95bec89f41e?w=600&q=80'],
  white:    ['https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'],
  blue:     ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80','https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80','https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80','https://images.unsplash.com/photo-1512327536842-5aa37d1ba3e3?w=600&q=80','https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=600&q=80','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80','https://images.unsplash.com/photo-1620963906748-5d2f5c69efde?w=600&q=80','https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80','https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80','https://images.unsplash.com/photo-1519338381761-c7523edc1f46?w=600&q=80','https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80','https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=600&q=80','https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80','https://images.unsplash.com/photo-1645789644649-f95bec89f41e?w=600&q=80','https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80'],
};

// -------- MEN JEANS --------
const MEN_JEANS = {
  slim:       ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80','https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'],
  skinny:     ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80','https://images.unsplash.com/photo-1601157206149-d31d7eb9e70e?w=600&q=80'],
  regular:    ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80','https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80'],
  relaxed:    ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80','https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80'],
  distressed: ['https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80'],
  ripped:     ['https://images.unsplash.com/photo-1598981457915-aea220950616?w=600&q=80','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'],
  washed:     ['https://images.unsplash.com/photo-1594576722512-582bcd11f2f8?w=600&q=80','https://images.unsplash.com/photo-1582223038903-45ef5b0f6c2d?w=600&q=80'],
  blue:       ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80','https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80'],
  black:      ['https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80','https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80'],
  grey:       ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80','https://images.unsplash.com/photo-1598981457915-aea220950616?w=600&q=80'],
  _default:   ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80','https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80','https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80','https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80','https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80','https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80','https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80','https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80','https://images.unsplash.com/photo-1598981457915-aea220950616?w=600&q=80','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80','https://images.unsplash.com/photo-1601157206149-d31d7eb9e70e?w=600&q=80'],
};

// -------- MEN LOWER/JOGGERS/TRACK --------
const MEN_LOWER = {
  _default: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80','https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80','https://images.unsplash.com/photo-1620138546344-7b2c38516edf?w=600&q=80','https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80','https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80','https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80','https://images.unsplash.com/photo-1591369822096-ffd140ec948b?w=600&q=80','https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80','https://images.unsplash.com/photo-1519748771451-a94c596fad67?w=600&q=80','https://images.unsplash.com/photo-1623520752609-0572b53bbd03?w=600&q=80','https://images.unsplash.com/photo-1565787959697-00c36f9e8ead?w=600&q=80'],
};

// -------- MEN SHORTS --------
const MEN_SHORTS = {
  cargo:    ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80','https://images.unsplash.com/photo-1617953141905-b27fb1f17d88?w=600&q=80'],
  sports:   ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80','https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=80','https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80','https://images.unsplash.com/photo-1617953141905-b27fb1f17d88?w=600&q=80','https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80','https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
};

// -------- MEN INNERWEAR --------
const MEN_INNERWEAR = {
  brief:    ['https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80','https://images.unsplash.com/photo-1620219365994-f443a86ea630?w=600&q=80','https://images.unsplash.com/photo-1617369120004-4042d5450380?w=600&q=80'],
  trunk:    ['https://images.unsplash.com/photo-1608286522905-f04a5c9abb97?w=600&q=80','https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600&q=80','https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80'],
  boxer:    ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80','https://images.unsplash.com/photo-1618517047922-d5b2f5c6ad0b?w=600&q=80','https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80'],
  vest:     ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80','https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80'],
  thermal:  ['https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80','https://images.unsplash.com/photo-1512327536842-5aa37d1ba3e3?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80','https://images.unsplash.com/photo-1620219365994-f443a86ea630?w=600&q=80','https://images.unsplash.com/photo-1608286522905-f04a5c9abb97?w=600&q=80','https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80','https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600&q=80','https://images.unsplash.com/photo-1618517047922-d5b2f5c6ad0b?w=600&q=80','https://images.unsplash.com/photo-1617369120004-4042d5450380?w=600&q=80','https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80','https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80','https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80'],
};

// -------- MEN HOODIE / SWEATSHIRT --------
const MEN_HOODIE = {
  _default: ['https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80','https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80','https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80','https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80','https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80','https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80','https://images.unsplash.com/photo-1602810319250-a663f0af2f75?w=600&q=80','https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80','https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80','https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80'],
};

// -------- MEN SHOES --------
const MEN_SHOES = {
  running:  ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'],
  sneakers: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'],
  sports:   ['https://images.unsplash.com/photo-1587545329015-a1e664ffc35a?w=600&q=80','https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80'],
  formal:   ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80','https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80'],
  casual:   ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80','https://images.unsplash.com/photo-1518894781321-630e638d0742?w=600&q=80'],
  sandals:  ['https://images.unsplash.com/photo-1561861422-a549073e547a?w=600&q=80','https://images.unsplash.com/photo-1517956636756-56e7fb1c37a6?w=600&q=80'],
  slippers: ['https://images.unsplash.com/photo-1523810192367-996b762e5bf6?w=600&q=80','https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80','https://images.unsplash.com/photo-1587545329015-a1e664ffc35a?w=600&q=80','https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80','https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80','https://images.unsplash.com/photo-1518894781321-630e638d0742?w=600&q=80','https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80','https://images.unsplash.com/photo-1561861422-a549073e547a?w=600&q=80','https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80','https://images.unsplash.com/photo-1517956636756-56e7fb1c37a6?w=600&q=80','https://images.unsplash.com/photo-1523810192367-996b762e5bf6?w=600&q=80'],
};

// -------- MEN WATCHES --------
const MEN_WATCHES = {
  analog:   ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80','https://images.unsplash.com/photo-1516048015710-7a3b4c86be43?w=600&q=80'],
  digital:  ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80','https://images.unsplash.com/photo-1594576722512-582bcd11f2f8?w=600&q=80'],
  smart:    ['https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=600&q=80','https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80','https://images.unsplash.com/photo-1516048015710-7a3b4c86be43?w=600&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80','https://images.unsplash.com/photo-1594576722512-582bcd11f2f8?w=600&q=80','https://images.unsplash.com/photo-1582623838120-c9f49a7c3b20?w=600&q=80','https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80','https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80','https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80','https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&q=80','https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=600&q=80','https://images.unsplash.com/photo-1586104195538-050b9f74f58e?w=600&q=80','https://images.unsplash.com/photo-1601158935942-52255782d322?w=600&q=80'],
};

// -------- WOMEN TOPS / T-SHIRTS --------
const WOMEN_TOP = {
  floral:  ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80','https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80'],
  white:   ['https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80','https://images.unsplash.com/photo-1569139901347-24e3cbe36c30?w=600&q=80'],
  black:   ['https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&q=80','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80'],
  pink:    ['https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80','https://images.unsplash.com/photo-1570299437071-f0b19f90d4ab?w=600&q=80'],
  blue:    ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80','https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80'],
  red:     ['https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80','https://images.unsplash.com/photo-1590060000792-bef3b7f3c432?w=600&q=80'],
  crop:    ['https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&q=80','https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80'],
  striped: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80','https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80','https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&q=80','https://images.unsplash.com/photo-1570299437071-f0b19f90d4ab?w=600&q=80','https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80','https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80','https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80','https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&q=80','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80','https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80','https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80','https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80','https://images.unsplash.com/photo-1590060000792-bef3b7f3c432?w=600&q=80'],
};

// -------- WOMEN SHIRT --------
const WOMEN_SHIRT = {
  _default: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80','https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80','https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80','https://images.unsplash.com/photo-1529903384028-929ae5dccdf1?w=600&q=80','https://images.unsplash.com/photo-1575822086081-6ab0de22c5c5?w=600&q=80','https://images.unsplash.com/photo-1557978619-8a14aab4ff29?w=600&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80','https://images.unsplash.com/photo-1630522374537-41b7a9b7a428?w=600&q=80'],
};

// -------- WOMEN JEANS --------
const WOMEN_JEANS = {
  _default: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80','https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80','https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80','https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80','https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80','https://images.unsplash.com/photo-1598981457915-aea220950616?w=600&q=80','https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80','https://images.unsplash.com/photo-1618517047922-d5b2f5c6ad0b?w=600&q=80','https://images.unsplash.com/photo-1549082984-1323b94df9a6?w=600&q=80','https://images.unsplash.com/photo-1594576722512-582bcd11f2f8?w=600&q=80'],
};

// -------- WOMEN LOWER / LEGGINGS --------
const WOMEN_LOWER = {
  leggings: ['https://images.unsplash.com/photo-1617369120004-4042d5450380?w=600&q=80','https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80'],
  palazzo:  ['https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80'],
  shorts:   ['https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1617369120004-4042d5450380?w=600&q=80','https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80','https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80','https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80','https://images.unsplash.com/photo-1585486386923-92ac3e2afdb2?w=600&q=80','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80','https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80','https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80'],
};

// -------- WOMEN INNERWEAR --------
const WOMEN_INNERWEAR = {
  bra:      ['https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80','https://images.unsplash.com/photo-1620219365994-f443a86ea630?w=600&q=80','https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80','https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600&q=80'],
  panty:    ['https://images.unsplash.com/photo-1618517047922-d5b2f5c6ad0b?w=600&q=80','https://images.unsplash.com/photo-1608286522905-f04a5c9abb97?w=600&q=80','https://images.unsplash.com/photo-1590060000792-bef3b7f3c432?w=600&q=80','https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
  sports:   ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80','https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80'],
  camisole: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80','https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80','https://images.unsplash.com/photo-1620219365994-f443a86ea630?w=600&q=80','https://images.unsplash.com/photo-1618517047922-d5b2f5c6ad0b?w=600&q=80','https://images.unsplash.com/photo-1608286522905-f04a5c9abb97?w=600&q=80','https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80','https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600&q=80','https://images.unsplash.com/photo-1590060000792-bef3b7f3c432?w=600&q=80','https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80','https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80','https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80','https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80'],
};

// -------- WOMEN SHOES --------
const WOMEN_SHOES = {
  heels:    ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80','https://images.unsplash.com/photo-1518049362265-d5b2839a6888?w=600&q=80'],
  sandals:  ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80','https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80'],
  flats:    ['https://images.unsplash.com/photo-1512982579810-d06b0a576eb7?w=600&q=80','https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80'],
  sneakers: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'],
  slippers: ['https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=600&q=80','https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80'],
  sports:   ['https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=600&q=80','https://images.unsplash.com/photo-1623296701793-af05b0e7e048?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80','https://images.unsplash.com/photo-1518049362265-d5b2839a6888?w=600&q=80','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80','https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80','https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80','https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=600&q=80','https://images.unsplash.com/photo-1512982579810-d06b0a576eb7?w=600&q=80','https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80','https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80','https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=600&q=80'],
};

// -------- WOMEN WATCHES --------
const WOMEN_WATCHES = {
  _default: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1619134778706-7015533a6150?w=600&q=80','https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80','https://images.unsplash.com/photo-1628883822534-7c9e5cd82cae?w=600&q=80','https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80','https://images.unsplash.com/photo-1578732537778-5e02b1c6acc5?w=600&q=80','https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80'],
};

// -------- KIDS --------
const KIDS_ALL = {
  tshirt:   ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80','https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80','https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80','https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80','https://images.unsplash.com/photo-1471286174890-9c1122606886?w=600&q=80','https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&q=80','https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=600&q=80','https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80','https://images.unsplash.com/photo-1582736317408-b6a359b72b07?w=600&q=80','https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80'],
  shirt:    ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80','https://images.unsplash.com/photo-1629795957681-dc5c40cd7a87?w=600&q=80','https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80','https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80'],
  jeans:    ['https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?w=600&q=80','https://images.unsplash.com/photo-1501183638710-841dd1904471?w=600&q=80','https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80','https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'],
  shoes:    ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80','https://images.unsplash.com/photo-1556906781-9a412961d28c?w=600&q=80'],
  lower:    ['https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?w=600&q=80','https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80','https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80','https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80'],
  shorts:   ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80','https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=80','https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80'],
  watches:  ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80','https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80','https://images.unsplash.com/photo-1628883822534-7c9e5cd82cae?w=600&q=80'],
  innerwear:['https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80','https://images.unsplash.com/photo-1608286522905-f04a5c9abb97?w=600&q=80','https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600&q=80'],
  hoodie:   ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80','https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80','https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80'],
  dress:    ['https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80','https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80','https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80'],
  _default: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80','https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80','https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&q=80','https://images.unsplash.com/photo-1471286174890-9c1122606886?w=600&q=80','https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80'],
};

// =============================================================
// KEYWORD EXTRACTION — reads product name and picks best pool
// =============================================================

function pickPool(name, catName, subcategory) {
  const n = name.toLowerCase();
  const cat = (catName || '').toLowerCase();
  const sub = (subcategory || '').toLowerCase();
  const isMen = cat.includes('men') && !cat.includes('women');
  const isWomen = cat.includes('women');
  const isKids = cat.includes('kid');

  // ---- MEN ----
  if (isMen) {
    if (sub === 'shoes' || sub === 'sandals' || n.includes('shoe') || n.includes('sneaker') || n.includes('running') || n.includes('loafer') || n.includes('slipper') || n.includes('sandal') || n.includes('formal shoe') || n.includes('oxford') || n.includes('boot')) {
      if (n.includes('running') || n.includes('sport')) return [MEN_SHOES, 'sports'];
      if (n.includes('sneaker')) return [MEN_SHOES, 'sneakers'];
      if (n.includes('formal') || n.includes('oxford')) return [MEN_SHOES, 'formal'];
      if (n.includes('slipper')) return [MEN_SHOES, 'slippers'];
      if (n.includes('sandal')) return [MEN_SHOES, 'sandals'];
      return [MEN_SHOES, '_default'];
    }
    if (sub === 'watches' || n.includes('watch')) {
      if (n.includes('analog')) return [MEN_WATCHES, 'analog'];
      if (n.includes('digital')) return [MEN_WATCHES, 'digital'];
      if (n.includes('smart')) return [MEN_WATCHES, 'smart'];
      return [MEN_WATCHES, '_default'];
    }
    if (sub === 'undergarments' || n.includes('brief') || n.includes('trunk') || n.includes('boxer') || n.includes('vest') || n.includes('baniyan') || n.includes('thermal') || n.includes('innerwear') || n.includes('underwear')) {
      if (n.includes('brief')) return [MEN_INNERWEAR, 'brief'];
      if (n.includes('trunk')) return [MEN_INNERWEAR, 'trunk'];
      if (n.includes('boxer')) return [MEN_INNERWEAR, 'boxer'];
      if (n.includes('vest') || n.includes('baniyan')) return [MEN_INNERWEAR, 'vest'];
      if (n.includes('thermal')) return [MEN_INNERWEAR, 'thermal'];
      return [MEN_INNERWEAR, '_default'];
    }
    if (sub === 'jeans' || n.includes('jean') || n.includes('denim pant') || n.includes('denim trouser')) {
      if (n.includes('slim')) return [MEN_JEANS, 'slim'];
      if (n.includes('skinny')) return [MEN_JEANS, 'skinny'];
      if (n.includes('relax') || n.includes('baggy') || n.includes('loose')) return [MEN_JEANS, 'relaxed'];
      if (n.includes('distress') || n.includes('torn') || n.includes('rip')) return [MEN_JEANS, 'distressed'];
      if (n.includes('wash')) return [MEN_JEANS, 'washed'];
      if (n.includes('black')) return [MEN_JEANS, 'black'];
      if (n.includes('grey') || n.includes('gray')) return [MEN_JEANS, 'grey'];
      return [MEN_JEANS, 'blue'];
    }
    if (sub === 'shirt' || n.includes('shirt') || n.includes('kurta') || n.includes('tunic')) {
      if (n.includes('check') || n.includes('plaid') || n.includes('tartan')) return [MEN_SHIRT, 'checked'];
      if (n.includes('strip') || n.includes('stripe')) return [MEN_SHIRT, 'striped'];
      if (n.includes('denim')) return [MEN_SHIRT, 'denim'];
      if (n.includes('linen')) return [MEN_SHIRT, 'linen'];
      if (n.includes('oxford')) return [MEN_SHIRT, 'oxford'];
      if (n.includes('floral')) return [MEN_SHIRT, 'floral'];
      if (n.includes('formal')) return [MEN_SHIRT, 'formal'];
      if (n.includes('white')) return [MEN_SHIRT, 'white'];
      if (n.includes('blue')) return [MEN_SHIRT, 'blue'];
      return [MEN_SHIRT, '_default'];
    }
    if (sub === 'lower' || sub === 'shorts' || n.includes('lower') || n.includes('track') || n.includes('jogger') || n.includes('pajama') || n.includes('pyjama')) {
      return [MEN_LOWER, '_default'];
    }
    if (n.includes('short') || n.includes('cargo short') || n.includes('sport short')) {
      if (n.includes('cargo')) return [MEN_SHORTS, 'cargo'];
      if (n.includes('sport')) return [MEN_SHORTS, 'sports'];
      return [MEN_SHORTS, '_default'];
    }
    if (n.includes('hoodie') || n.includes('sweatshirt') || n.includes('fleece') || n.includes('pullover')) return [MEN_HOODIE, '_default'];
    // Default: t-shirt
    if (n.includes('polo')) return [MEN_TSHIRT, 'polo'];
    if (n.includes('graphic') || n.includes('print')) return [MEN_TSHIRT, 'graphic'];
    if (n.includes('oversized')) return [MEN_TSHIRT, 'oversized'];
    if (n.includes('white')) return [MEN_TSHIRT, 'white'];
    if (n.includes('black')) return [MEN_TSHIRT, 'black'];
    if (n.includes('navy')) return [MEN_TSHIRT, 'navy'];
    if (n.includes('blue')) return [MEN_TSHIRT, 'blue'];
    if (n.includes('grey') || n.includes('gray')) return [MEN_TSHIRT, 'grey'];
    if (n.includes('red') || n.includes('maroon')) return [MEN_TSHIRT, 'red'];
    if (n.includes('green')) return [MEN_TSHIRT, 'green'];
    if (n.includes('yellow') || n.includes('mustard')) return [MEN_TSHIRT, 'yellow'];
    return [MEN_TSHIRT, '_default'];
  }

  // ---- WOMEN ----
  if (isWomen) {
    if (sub === 'shoes' || n.includes('heel') || n.includes('sandal') || n.includes('flat') || n.includes('sneaker') || n.includes('slipper') || n.includes('shoe') || n.includes('footwear') || n.includes('boot')) {
      if (n.includes('heel')) return [WOMEN_SHOES, 'heels'];
      if (n.includes('sandal')) return [WOMEN_SHOES, 'sandals'];
      if (n.includes('flat')) return [WOMEN_SHOES, 'flats'];
      if (n.includes('sneaker') || n.includes('sport')) return [WOMEN_SHOES, 'sneakers'];
      if (n.includes('slipper')) return [WOMEN_SHOES, 'slippers'];
      return [WOMEN_SHOES, '_default'];
    }
    if (sub === 'watches' || n.includes('watch')) return [WOMEN_WATCHES, '_default'];
    if (sub === 'undergarments' || n.includes('bra') || n.includes('panty') || n.includes('panties') || n.includes('innerwear') || n.includes('camisole') || n.includes('shapewear') || n.includes('lingerie')) {
      if (n.includes('panty') || n.includes('panties')) return [WOMEN_INNERWEAR, 'panty'];
      if (n.includes('sport')) return [WOMEN_INNERWEAR, 'sports'];
      if (n.includes('camisole')) return [WOMEN_INNERWEAR, 'camisole'];
      return [WOMEN_INNERWEAR, 'bra'];
    }
    if (sub === 'jeans' || n.includes('jean') || n.includes('jegging') || n.includes('denim')) return [WOMEN_JEANS, '_default'];
    if (sub === 'lower' || n.includes('legging') || n.includes('palazzo') || n.includes('trouser') || n.includes('pant') || n.includes('short') || n.includes('lower')) {
      if (n.includes('legging')) return [WOMEN_LOWER, 'leggings'];
      if (n.includes('palazzo')) return [WOMEN_LOWER, 'palazzo'];
      if (n.includes('short')) return [WOMEN_LOWER, 'shorts'];
      return [WOMEN_LOWER, '_default'];
    }
    if (n.includes('shirt') || n.includes('blouse')) return [WOMEN_SHIRT, '_default'];
    if (n.includes('hoodie') || n.includes('sweatshirt')) return [MEN_HOODIE, '_default'];
    // Top / T-shirt / Crop / Tunic / Kurti / Dress / etc.
    if (n.includes('crop')) return [WOMEN_TOP, 'crop'];
    if (n.includes('strip') || n.includes('stripe')) return [WOMEN_TOP, 'striped'];
    if (n.includes('floral')) return [WOMEN_TOP, 'floral'];
    if (n.includes('white')) return [WOMEN_TOP, 'white'];
    if (n.includes('black')) return [WOMEN_TOP, 'black'];
    if (n.includes('pink')) return [WOMEN_TOP, 'pink'];
    if (n.includes('blue')) return [WOMEN_TOP, 'blue'];
    if (n.includes('red')) return [WOMEN_TOP, 'red'];
    return [WOMEN_TOP, '_default'];
  }

  // ---- KIDS ----
  if (isKids) {
    if (n.includes('shoe') || n.includes('sneaker') || n.includes('sandal') || n.includes('boot') || n.includes('footwear')) return [KIDS_ALL, 'shoes'];
    if (n.includes('watch')) return [KIDS_ALL, 'watches'];
    if (n.includes('innerwear') || n.includes('underwear') || n.includes('brief') || n.includes('trunk') || n.includes('bra') || n.includes('panty')) return [KIDS_ALL, 'innerwear'];
    if (n.includes('hoodie') || n.includes('sweatshirt')) return [KIDS_ALL, 'hoodie'];
    if (n.includes('jean') || n.includes('denim')) return [KIDS_ALL, 'jeans'];
    if (n.includes('shirt') && !n.includes('t-shirt') && !n.includes('tshirt')) return [KIDS_ALL, 'shirt'];
    if (n.includes('lower') || n.includes('track') || n.includes('jogger') || n.includes('pant') || n.includes('trouser')) return [KIDS_ALL, 'lower'];
    if (n.includes('short')) return [KIDS_ALL, 'shorts'];
    if (n.includes('dress') || n.includes('frock') || n.includes('skirt') || n.includes('romper') || n.includes('bodysuit')) return [KIDS_ALL, 'dress'];
    return [KIDS_ALL, 'tshirt'];
  }

  // Fallback
  return [MEN_TSHIRT, '_default'];
}

// Track usage per pool key to avoid repeats
const usageTracker = new Map();

function getUniqueImageFromPool(pool, key) {
  const arr = pool[key] || pool['_default'];
  const trackKey = JSON.stringify(arr.slice(0, 2)); // identifier for this pool
  if (!usageTracker.has(trackKey)) usageTracker.set(trackKey, 0);
  const idx = usageTracker.get(trackKey) % arr.length;
  usageTracker.set(trackKey, idx + 1);
  // Add unique cache param
  return arr[idx] + `&u=${Date.now().toString(36)}-${Math.random().toString(36).slice(2,5)}`;
}

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({}).populate('category').lean();
    console.log(`📦 Found ${products.length} products`);

    let updated = 0, failed = 0;

    for (const product of products) {
      try {
        const catName = product.category?.name || '';
        const [pool, key] = pickPool(product.name, catName, product.subcategory);
        const imageUrl = getUniqueImageFromPool(pool, key);

        await Product.updateOne(
          { _id: product._id },
          { $set: { images: [{ url: imageUrl, publicId: `img_${product._id}` }] } }
        );
        updated++;
        if (updated % 100 === 0) console.log(`  ⏳ ${updated}/${products.length} updated...`);
      } catch (err) {
        console.error(`❌ Failed: ${product.name}:`, err.message);
        failed++;
      }
    }

    console.log(`\n✅ DONE! Updated: ${updated} | Failed: ${failed} | Total: ${products.length}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Script Error:', err);
    process.exit(1);
  }
}

updateImages();
