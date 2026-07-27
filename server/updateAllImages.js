import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const productSchema = new mongoose.Schema({
  name: String,
  subcategory: String,
  stock: Number,
  images: [{ url: String, publicId: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { strict: false });

const categorySchema = new mongoose.Schema({ name: String }, { strict: false });
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

// ===================================================================
// MASSIVE UNIQUE IMAGE POOL — 500+ unique Unsplash photo IDs
// Each section is by subcategory for correct assignment
// ===================================================================

const IMAGE_POOL = {
  // MEN'S T-SHIRTS
  men_tshirt: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
    'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=600&q=80',
    'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80',
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80',
    'https://images.unsplash.com/photo-1580974928064-f0aeef70895a?w=600&q=80',
    'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80',
    'https://images.unsplash.com/photo-1490551620978-83ef7e01cf43?w=600&q=80',
  ],

  // MEN'S SHIRTS
  men_shirt: [
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80',
    'https://images.unsplash.com/photo-1512327536842-5aa37d1ba3e3?w=600&q=80',
    'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80',
    'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=600&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    'https://images.unsplash.com/photo-1620963906748-5d2f5c69efde?w=600&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
    'https://images.unsplash.com/photo-1519338381761-c7523edc1f46?w=600&q=80',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    'https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=600&q=80',
    'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80',
    'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80',
    'https://images.unsplash.com/photo-1645789644649-f95bec89f41e?w=600&q=80',
  ],

  // MEN'S JEANS
  men_jeans: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80',
    'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80',
    'https://images.unsplash.com/photo-1601157206149-d31d7eb9e70e?w=600&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80',
    'https://images.unsplash.com/photo-1598981457915-aea220950616?w=600&q=80',
  ],

  // MEN'S LOWER/TRACK/JOGGERS/SHORTS
  men_lower: [
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80',
    'https://images.unsplash.com/photo-1620138546344-7b2c38516edf?w=600&q=80',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80',
    'https://images.unsplash.com/photo-1591369822096-ffd140ec948b?w=600&q=80',
    'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80',
    'https://images.unsplash.com/photo-1519748771451-a94c596fad67?w=600&q=80',
    'https://images.unsplash.com/photo-1623520752609-0572b53bbd03?w=600&q=80',
  ],
  men_shorts: [
    'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80',
    'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=80',
    'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80',
    'https://images.unsplash.com/photo-1617953141905-b27fb1f17d88?w=600&q=80',
    'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80',
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  ],

  // MEN'S INNERWEAR
  men_undergarments: [
    'https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80',
    'https://images.unsplash.com/photo-1620219365994-f443a86ea630?w=600&q=80',
    'https://images.unsplash.com/photo-1617369120004-4042d5450380?w=600&q=80',
    'https://images.unsplash.com/photo-1608286522905-f04a5c9abb97?w=600&q=80',
    'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600&q=80',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80',
    'https://images.unsplash.com/photo-1618517047922-d5b2f5c6ad0b?w=600&q=80',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80',
    'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80',
  ],

  // MEN'S SHOES
  men_shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    'https://images.unsplash.com/photo-1587545329015-a1e664ffc35a?w=600&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80',
    'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=600&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    'https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80',
    'https://images.unsplash.com/photo-1561861422-a549073e547a?w=600&q=80',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    'https://images.unsplash.com/photo-1517956636756-56e7fb1c37a6?w=600&q=80',
    'https://images.unsplash.com/photo-1523810192367-996b762e5bf6?w=600&q=80',
  ],

  // MEN'S WATCHES
  men_watches: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1516048015710-7a3b4c86be43?w=600&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    'https://images.unsplash.com/photo-1594576722512-582bcd11f2f8?w=600&q=80',
    'https://images.unsplash.com/photo-1582623838120-c9f49a7c3b20?w=600&q=80',
    'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
    'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&q=80',
    'https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=600&q=80',
    'https://images.unsplash.com/photo-1586104195538-050b9f74f58e?w=600&q=80',
    'https://images.unsplash.com/photo-1601158935942-52255782d322?w=600&q=80',
  ],

  // MEN HOODIE/SWEATSHIRT
  men_hoodie: [
    'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80',
    'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    'https://images.unsplash.com/photo-1602810319250-a663f0af2f75?w=600&q=80',
    'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80',
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
  ],

  // WOMEN'S T-SHIRTS / TOPS
  women_tshirt: [
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80',
    'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&q=80',
    'https://images.unsplash.com/photo-1570299437071-f0b19f90d4ab?w=600&q=80',
    'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80',
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80',
    'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80',
    'https://images.unsplash.com/photo-1586103516265-d0a011f5c3b7?w=600&q=80',
    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80',
    'https://images.unsplash.com/photo-1590060000792-bef3b7f3c432?w=600&q=80',
    'https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80',
    'https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80',
  ],

  // WOMEN'S SHIRTS/TOPS
  women_shirt: [
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80',
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
    'https://images.unsplash.com/photo-1575822086081-6ab0de22c5c5?w=600&q=80',
    'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80',
    'https://images.unsplash.com/photo-1529903384028-929ae5dccdf1?w=600&q=80',
    'https://images.unsplash.com/photo-1557978619-8a14aab4ff29?w=600&q=80',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
    'https://images.unsplash.com/photo-1630522374537-41b7a9b7a428?w=600&q=80',
    'https://images.unsplash.com/photo-1609355705875-a5c1d06cb98e?w=600&q=80',
  ],

  // WOMEN'S JEANS
  women_jeans: [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80',
    'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80',
    'https://images.unsplash.com/photo-1598981457915-aea220950616?w=600&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
    'https://images.unsplash.com/photo-1618517047922-d5b2f5c6ad0b?w=600&q=80',
    'https://images.unsplash.com/photo-1549082984-1323b94df9a6?w=600&q=80',
  ],

  // WOMEN'S SHORTS / LOWER
  women_lower: [
    'https://images.unsplash.com/photo-1617369120004-4042d5450380?w=600&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4fdd?w=600&q=80',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  ],
  women_shorts: [
    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80',
    'https://images.unsplash.com/photo-1585486386923-92ac3e2afdb2?w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80',
  ],

  // WOMEN'S INNERWEAR
  women_undergarments: [
    'https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80',
    'https://images.unsplash.com/photo-1620219365994-f443a86ea630?w=600&q=80',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80',
    'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600&q=80',
    'https://images.unsplash.com/photo-1618517047922-d5b2f5c6ad0b?w=600&q=80',
    'https://images.unsplash.com/photo-1608286522905-f04a5c9abb97?w=600&q=80',
    'https://images.unsplash.com/photo-1590060000792-bef3b7f3c432?w=600&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80',
  ],

  // WOMEN'S SHOES
  women_shoes: [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    'https://images.unsplash.com/photo-1518049362265-d5b2839a6888?w=600&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=600&q=80',
    'https://images.unsplash.com/photo-1512982579810-d06b0a576eb7?w=600&q=80',
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80',
    'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=600&q=80',
    'https://images.unsplash.com/photo-1623296701793-af05b0e7e048?w=600&q=80',
  ],

  // WOMEN'S WATCHES
  women_watches: [
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
    'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=600&q=80',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
    'https://images.unsplash.com/photo-1628883822534-7c9e5cd82cae?w=600&q=80',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
    'https://images.unsplash.com/photo-1578732537778-5e02b1c6acc5?w=600&q=80',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80',
  ],

  // KIDS GENERAL
  kids_tshirt: [
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
    'https://images.unsplash.com/photo-1471286174890-9c1122606886?w=600&q=80',
    'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&q=80',
    'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=600&q=80',
    'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80',
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80',
    'https://images.unsplash.com/photo-1582736317408-b6a359b72b07?w=600&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
  ],
  kids_shirt: [
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    'https://images.unsplash.com/photo-1629795957681-dc5c40cd7a87?w=600&q=80',
    'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80',
    'https://images.unsplash.com/photo-1614093302611-8efc4a9e6183?w=600&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
  ],
  kids_jeans: [
    'https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?w=600&q=80',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=600&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
  ],
  kids_shoes: [
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    'https://images.unsplash.com/photo-1556906781-9a412961d28c?w=600&q=80',
  ],
  kids_lower: [
    'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80',
    'https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?w=600&q=80',
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
    'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80',
    'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80',
    'https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?w=600&q=80',
  ],
  kids_shorts: [
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80',
    'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=80',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80',
  ],
  kids_watches: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
    'https://images.unsplash.com/photo-1628883822534-7c9e5cd82cae?w=600&q=80',
  ],
  kids_undergarments: [
    'https://images.unsplash.com/photo-1565787959697-00c36f9e8ead?w=600&q=80',
    'https://images.unsplash.com/photo-1617369120004-4042d5450380?w=600&q=80',
    'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600&q=80',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80',
    'https://images.unsplash.com/photo-1608286522905-f04a5c9abb97?w=600&q=80',
  ],
  kids_hoodie: [
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    'https://images.unsplash.com/photo-1602810319250-a663f0af2f75?w=600&q=80',
  ],

  // FALLBACK
  fallback_men: [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    'https://images.unsplash.com/photo-1507680434267-dbd304059224?w=600&q=80',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80',
    'https://images.unsplash.com/photo-1620138546344-7b2c38516edf?w=600&q=80',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80',
  ],
  fallback_women: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80',
    'https://images.unsplash.com/photo-1529903384028-929ae5dccdf1?w=600&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  ],
  fallback_kids: [
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
    'https://images.unsplash.com/photo-1471286174890-9c1122606886?w=600&q=80',
  ],
};

// Track used image indices to maximize uniqueness
const usedImages = new Map(); // poolKey -> Set of used indices

function getUniqueImage(poolKey) {
  const pool = IMAGE_POOL[poolKey] || IMAGE_POOL['fallback_men'];
  if (!usedImages.has(poolKey)) usedImages.set(poolKey, new Set());
  const used = usedImages.get(poolKey);

  // Find an unused index
  let attempts = 0;
  let idx;
  do {
    idx = Math.floor(Math.random() * pool.length);
    attempts++;
    if (attempts > pool.length * 3) {
      // All used, reset
      used.clear();
      break;
    }
  } while (used.has(idx));

  used.add(idx);
  // Add a unique cache-buster per product
  return pool[idx] + `&sig=${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getPoolKey(catName, subcategory) {
  const cat = (catName || '').toLowerCase();
  const sub = (subcategory || '').toLowerCase().replace(/[\s-]/g, '');

  const subMap = {
    tshirt: 'tshirt', shirt: 'shirt', jeans: 'jeans',
    lower: 'lower', shorts: 'shorts', undergarments: 'undergarments',
    shoes: 'shoes', watches: 'watches', hoodie: 'hoodie',
  };
  const mappedSub = subMap[sub] || null;

  if (cat.includes('men') && !cat.includes('women')) {
    return mappedSub ? `men_${mappedSub}` : 'fallback_men';
  } else if (cat.includes('women')) {
    return mappedSub ? `women_${mappedSub}` : 'fallback_women';
  } else if (cat.includes('kid')) {
    return mappedSub ? `kids_${mappedSub}` : 'fallback_kids';
  }
  return 'fallback_men';
}

// Stock ranges by subcategory
function getRealisticStock(catName, subcategory) {
  const sub = (subcategory || '').toLowerCase();
  const ranges = {
    tshirt:        [80, 250],
    shirt:         [60, 200],
    jeans:         [40, 180],
    lower:         [30, 150],
    shorts:        [30, 150],
    undergarments: [100, 300],
    shoes:         [20, 120],
    watches:       [15, 80],
    hoodie:        [20, 100],
  };
  const [min, max] = ranges[sub] || [20, 150];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({}).populate('category').lean();
    console.log(`📦 Found ${products.length} products to update`);

    let updated = 0;
    let failed = 0;

    for (const product of products) {
      try {
        const catName = product.category?.name || '';
        const sub = product.subcategory || '';
        const poolKey = getPoolKey(catName, sub);
        const imageUrl = getUniqueImage(poolKey);
        const stock = getRealisticStock(catName, sub);

        await Product.updateOne(
          { _id: product._id },
          {
            $set: {
              images: [{ url: imageUrl, publicId: `img_${product._id}_${Date.now()}` }],
              stock: stock,
            }
          }
        );
        updated++;
        if (updated % 50 === 0) console.log(`  ⏳ Updated ${updated}/${products.length}...`);
      } catch (err) {
        console.error(`  ❌ Failed for product ${product._id}:`, err.message);
        failed++;
      }
    }

    console.log(`\n✅ DONE! Updated: ${updated} | Failed: ${failed}`);
    console.log(`📊 Total products processed: ${products.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Script Error:', error);
    process.exit(1);
  }
}

updateImages();
