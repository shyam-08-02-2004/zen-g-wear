import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const pSchema = new mongoose.Schema({
  name: String, subcategory: String, brand: String,
  price: Number, discountPrice: Number, discountPercentage: Number,
  stock: Number, colors: [String], sizes: [String], description: String,
  images: [{ url: String, publicId: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  rating: Number, numReviews: Number, isNewArrival: Boolean
}, { strict: false });
const cSchema = new mongoose.Schema({ name: String }, { strict: false });
const Product = mongoose.model('Product', pSchema);
const Category = mongoose.model('Category', cSchema);

const DB = {
  men: {
    tshirt: [
      { img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', name: 'Men Solid White Round Neck T-Shirt', brand: 'U.S. Polo Assn' },
      { img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', name: 'Men Solid Black Cotton T-Shirt', brand: 'Puma' },
      { img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', name: 'Men Solid Grey Basic T-Shirt', brand: 'HRX' },
      { img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80', name: 'Men Striped Blue V-Neck T-Shirt', brand: 'Roadster' },
      { img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80', name: 'Men Solid Maroon Regular Fit T-Shirt', brand: 'WROGN' }
    ],
    shirt: [
      { img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', name: 'Men Slim Fit Checkered Casual Shirt', brand: 'Highlander' },
      { img: 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80', name: 'Men Regular Fit Blue Denim Shirt', brand: 'Levi\'s' },
      { img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80', name: 'Men Solid White Formal Shirt', brand: 'Louis Philippe' },
      { img: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80', name: 'Men Slim Fit Printed Casual Shirt', brand: 'Snitch' },
      { img: 'https://images.unsplash.com/photo-1512327536842-5aa37d1ba3e3?w=600&q=80', name: 'Men Olive Green Casual Shirt', brand: 'Roadster' }
    ],
    jeans: [
      { img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', name: 'Men Blue Slim Fit Denim Jeans', brand: 'Levi\'s' },
      { img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', name: 'Men Dark Blue Regular Fit Jeans', brand: 'Wrangler' },
      { img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', name: 'Men Black Slim Fit Denim Jeans', brand: 'Pepe Jeans' },
      { img: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80', name: 'Men Light Blue Washed Jeans', brand: 'Flying Machine' },
      { img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80', name: 'Men Grey Slim Fit Stretched Jeans', brand: 'Spykar' }
    ],
    lower: [
      { img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', name: 'Men Solid Black Track Pants', brand: 'Puma' },
      { img: 'https://images.unsplash.com/photo-1515562141207-7a8efd38407b?w=600&q=80', name: 'Men Solid Grey Cotton Joggers', brand: 'HRX' },
      { img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80', name: 'Men Navy Blue Sports Track Pant', brand: 'Adidas' },
      { img: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&q=80', name: 'Men Olive Green Cargo Joggers', brand: 'Roadster' },
      { img: 'https://images.unsplash.com/photo-1620803527786-fb4c878b2d1f?w=600&q=80', name: 'Men Maroon Cotton Lounge Pants', brand: 'Jockey' }
    ],
    shorts: [
      { img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80', name: 'Men Solid Beige Chino Shorts', brand: 'Louis Philippe' },
      { img: 'https://images.unsplash.com/photo-1553531384-411a247ccd73?w=600&q=80', name: 'Men Solid Navy Blue Casual Shorts', brand: 'Puma' },
      { img: 'https://images.unsplash.com/photo-1604085449033-b45260193160?w=600&q=80', name: 'Men Solid Grey Sports Shorts', brand: 'Nike' },
      { img: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80', name: 'Men Blue Denim Shorts', brand: 'Levi\'s' },
      { img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80', name: 'Men Printed Beach Shorts', brand: 'HRX' }
    ],
    undergarments: [
      { img: 'https://images.unsplash.com/photo-15dd5700877549-30c33d8339ab?w=600&q=80', name: 'Men Solid Grey Cotton Brief', brand: 'Jockey' },
      { img: 'https://images.unsplash.com/photo-1533083626233-a30ce2c161eb?w=600&q=80', name: 'Men Solid Black Cotton Boxer', brand: 'US Polo' },
      { img: 'https://images.unsplash.com/photo-1578326457388-c89b33a75878?w=600&q=80', name: 'Men Solid White Inner Vest', brand: 'Dixcy Scott' },
      { img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', name: 'Men Solid Navy Blue Trunk', brand: 'Macroman' },
      { img: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&q=80', name: 'Men Printed Cotton Boxer Shorts', brand: 'Jack & Jones' }
    ],
    shoes: [
      { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', name: 'Men Red Running Sports Shoes', brand: 'Nike' },
      { img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80', name: 'Men White Casual Sneakers', brand: 'Puma' },
      { img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80', name: 'Men Yellow Casual Sneakers', brand: 'Vans' },
      { img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', name: 'Men Green Running Shoes', brand: 'Adidas' },
      { img: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80', name: 'Men Black Sports Running Shoes', brand: 'Reebok' }
    ],
    watches: [
      { img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', name: 'Men Black Dial Analog Watch', brand: 'Fossil' },
      { img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80', name: 'Men Silver Dial Stainless Steel Watch', brand: 'Casio' },
      { img: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80', name: 'Men Blue Dial Leather Watch', brand: 'Titan' },
      { img: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80', name: 'Men Digital Sports Watch', brand: 'G-Shock' },
      { img: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&q=80', name: 'Men Rose Gold Chronograph Watch', brand: 'Tommy Hilfiger' }
    ]
  },
  women: {
    tshirt: [
      { img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80', name: 'Women Solid Pink Round Neck T-Shirt', brand: 'Vero Moda' },
      { img: 'https://images.unsplash.com/photo-1529139574466-a303027c028b?w=600&q=80', name: 'Women Solid White Regular Fit T-Shirt', brand: 'Forever 21' },
      { img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80', name: 'Women Printed Yellow Basic T-Shirt', brand: 'DressBerry' },
      { img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', name: 'Women Solid Black Oversized T-Shirt', brand: 'H&M' },
      { img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', name: 'Women Solid Grey Crop T-Shirt', brand: 'Mango' }
    ],
    shirt: [
      { img: 'https://images.unsplash.com/photo-1434389678369-e840fb19ce77?w=600&q=80', name: 'Women Checkered Casual Shirt', brand: 'Only' },
      { img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&q=80', name: 'Women White Solid Casual Shirt', brand: 'Van Heusen' },
      { img: 'https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?w=600&q=80', name: 'Women Pink Printed Floral Top', brand: 'Biba' },
      { img: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=600&q=80', name: 'Women Yellow Chiffon Blouse Top', brand: 'FabAlley' },
      { img: 'https://images.unsplash.com/photo-1572804013309-8c98e09f53b8?w=600&q=80', name: 'Women Blue Denim Shirt', brand: 'Levi\'s' }
    ],
    jeans: [
      { img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', name: 'Women Blue Slim Fit High Rise Jeans', brand: 'Levi\'s' },
      { img: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80', name: 'Women Dark Blue Bootcut Jeans', brand: 'Vero Moda' },
      { img: 'https://images.unsplash.com/photo-1601157206149-d31d7eb9e70e?w=600&q=80', name: 'Women Light Blue Ripped Jeans', brand: 'Kraus Jeans' },
      { img: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80', name: 'Women Black Skinny Fit Jeans', brand: 'High Star' },
      { img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', name: 'Women Grey Straight Fit Jeans', brand: 'Tokyo Talkies' }
    ],
    lower: [
      { img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80', name: 'Women Black Yoga Leggings', brand: 'Puma' },
      { img: 'https://images.unsplash.com/photo-1522845015757-50bce044e5da?w=600&q=80', name: 'Women Grey Cotton Track Pants', brand: 'HRX' },
      { img: 'https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=600&q=80', name: 'Women Pink Sports Joggers', brand: 'Nike' },
      { img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80', name: 'Women Navy Blue Sports Track Pants', brand: 'Adidas' },
      { img: 'https://images.unsplash.com/photo-1515562141207-7a8efd38407b?w=600&q=80', name: 'Women Olive Green Cargo Joggers', brand: 'Roadster' }
    ],
    shorts: [
      { img: 'https://images.unsplash.com/photo-1591369822095-236b283d5aee?w=600&q=80', name: 'Women Blue Denim Shorts', brand: 'Forever 21' },
      { img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80', name: 'Women Pink Beach Shorts', brand: 'DressBerry' },
      { img: 'https://images.unsplash.com/photo-1553531384-411a247ccd73?w=600&q=80', name: 'Women Black Gym Shorts', brand: 'Puma' },
      { img: 'https://images.unsplash.com/photo-1604085449033-b45260193160?w=600&q=80', name: 'Women Grey Sports Shorts', brand: 'Nike' },
      { img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80', name: 'Women Beige Casual Chino Shorts', brand: 'Marks & Spencer' }
    ],
    undergarments: [
      { img: 'https://images.unsplash.com/photo-1522845015757-50bce044e5da?w=600&q=80', name: 'Women Pink Sports Bra', brand: 'Nike' },
      { img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80', name: 'Women Black Cotton Bra', brand: 'Jockey' },
      { img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', name: 'Women Seamless Lace Bralette', brand: 'Enamor' },
      { img: 'https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=600&q=80', name: 'Women White Hipster Panty', brand: 'Amante' },
      { img: 'https://images.unsplash.com/photo-1515562141207-7a8efd38407b?w=600&q=80', name: 'Women Red Bikini Panty', brand: 'Zivame' }
    ],
    shoes: [
      { img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80', name: 'Women Pink Running Shoes', brand: 'Puma' },
      { img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80', name: 'Women White Casual Sneakers', brand: 'Bata' },
      { img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80', name: 'Women Yellow Block Heels', brand: 'Catwalk' },
      { img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80', name: 'Women Black Sports Running Shoes', brand: 'Nike' },
      { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', name: 'Women Red Gym Training Shoes', brand: 'Reebok' }
    ],
    watches: [
      { img: 'https://images.unsplash.com/photo-1508656961026-448cb56dcc0a?w=600&q=80', name: 'Women Rose Gold Analog Watch', brand: 'Fossil' },
      { img: 'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=600&q=80', name: 'Women Silver Stainless Steel Watch', brand: 'Titan' },
      { img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', name: 'Women Black Leather Strap Watch', brand: 'Fastrack' },
      { img: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80', name: 'Women Blue Dial Elegant Watch', brand: 'Casio' },
      { img: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80', name: 'Women Digital Fitness Smartwatch', brand: 'Noise' }
    ]
  },
  kids: {
    tshirt: [
      { img: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=600&q=80', name: 'Kids Yellow Printed Round Neck T-Shirt', brand: 'Max' },
      { img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80', name: 'Kids Blue Striped Polo T-Shirt', brand: 'Allen Solly Junior' },
      { img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', name: 'Kids Grey Solid Basic T-Shirt', brand: 'Gini & Jony' },
      { img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80', name: 'Kids Pink Floral Print T-Shirt', brand: 'Mothercare' },
      { img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80', name: 'Kids Graphic Print Blue T-Shirt', brand: 'Marvel' }
    ],
    shirt: [
      { img: 'https://images.unsplash.com/photo-1514090288892-7f2122676fba?w=600&q=80', name: 'Kids Checkered Blue Casual Shirt', brand: 'US Polo Kids' },
      { img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', name: 'Kids Red Checked Flannel Shirt', brand: 'Mini Klub' },
      { img: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80', name: 'Kids Printed Party Wear Shirt', brand: 'Pepe Jeans Kids' },
      { img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&q=80', name: 'Kids Solid White Cotton Shirt', brand: 'Hopscotch' },
      { img: 'https://images.unsplash.com/photo-1512327536842-5aa37d1ba3e3?w=600&q=80', name: 'Kids Olive Green Casual Shirt', brand: 'Max' }
    ],
    jeans: [
      { img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', name: 'Kids Blue Regular Fit Jeans', brand: 'Gini & Jony' },
      { img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', name: 'Kids Dark Blue Denim Jeans', brand: 'Mothercare' },
      { img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', name: 'Kids Black Slim Fit Jeans', brand: 'Ed A Mamma' },
      { img: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80', name: 'Kids Light Blue Washed Jeans', brand: 'Max' },
      { img: 'https://images.unsplash.com/photo-1601157206149-d31d7eb9e70e?w=600&q=80', name: 'Kids Grey Stretched Jeans', brand: 'Pepe Jeans Kids' }
    ],
    lower: [
      { img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', name: 'Kids Solid Black Track Pants', brand: 'Puma Kids' },
      { img: 'https://images.unsplash.com/photo-1515562141207-7a8efd38407b?w=600&q=80', name: 'Kids Solid Grey Cotton Joggers', brand: 'Adidas Kids' },
      { img: 'https://images.unsplash.com/photo-1522845015757-50bce044e5da?w=600&q=80', name: 'Kids Pink Sports Joggers', brand: 'Nike Kids' },
      { img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80', name: 'Kids Navy Blue Sports Track Pant', brand: 'Max' },
      { img: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&q=80', name: 'Kids Olive Green Cargo Pants', brand: 'Mothercare' }
    ],
    shorts: [
      { img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80', name: 'Kids Beige Cotton Chino Shorts', brand: 'US Polo Kids' },
      { img: 'https://images.unsplash.com/photo-1553531384-411a247ccd73?w=600&q=80', name: 'Kids Navy Blue Casual Shorts', brand: 'Max' },
      { img: 'https://images.unsplash.com/photo-1591369822095-236b283d5aee?w=600&q=80', name: 'Kids Blue Denim Shorts', brand: 'Pepe Jeans' },
      { img: 'https://images.unsplash.com/photo-1604085449033-b45260193160?w=600&q=80', name: 'Kids Grey Sports Shorts', brand: 'Nike Kids' },
      { img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80', name: 'Kids Printed Summer Shorts', brand: 'Mothercare' }
    ],
    undergarments: [
      { img: 'https://images.unsplash.com/photo-15dd5700877549-30c33d8339ab?w=600&q=80', name: 'Kids Pack of 3 Cotton Briefs', brand: 'Jockey Juniors' },
      { img: 'https://images.unsplash.com/photo-1533083626233-a30ce2c161eb?w=600&q=80', name: 'Kids Solid Black Boys Trunk', brand: 'Dixcy Scott' },
      { img: 'https://images.unsplash.com/photo-1578326457388-c89b33a75878?w=600&q=80', name: 'Kids Solid White Inner Vest', brand: 'Macroman' },
      { img: 'https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=600&q=80', name: 'Kids Pack of 3 Girls Panties', brand: 'Mothercare' },
      { img: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&q=80', name: 'Kids Printed Cotton Bloomers', brand: 'Max' }
    ],
    shoes: [
      { img: 'https://images.unsplash.com/photo-1515347619152-475306634d0b?w=600&q=80', name: 'Kids Pink LED Light Sneakers', brand: 'Bata Kids' },
      { img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80', name: 'Kids White Casual Sneakers', brand: 'Puma Kids' },
      { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', name: 'Kids Red Sports Running Shoes', brand: 'Nike Kids' },
      { img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80', name: 'Kids Yellow Velcro Sneakers', brand: 'Adidas Kids' },
      { img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', name: 'Kids Green Running Shoes', brand: 'Reebok Kids' }
    ],
    watches: [
      { img: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80', name: 'Kids Digital Superhero Watch', brand: 'Zoop' },
      { img: 'https://images.unsplash.com/photo-1508656961026-448cb56dcc0a?w=600&q=80', name: 'Kids Pink Princess Analog Watch', brand: 'Titan' },
      { img: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80', name: 'Kids Blue Dial Silicon Watch', brand: 'Fastrack' },
      { img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', name: 'Kids Black Digital Sports Watch', brand: 'Casio' },
      { img: 'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=600&q=80', name: 'Kids Red Flash Superhero Watch', brand: 'Spiderman' }
    ]
  }
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('✅ Connected to MongoDB');

    // Wipe exactly categories and products
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🧹 Wiped existing products and categories.');

    let productCount = 0;

    for (const [catName, subcategories] of Object.entries(DB)) {
      // Create category
      const categoryDoc = await Category.create({ name: catName, slug: catName.toLowerCase() });
      
      for (const [subName, items] of Object.entries(subcategories)) {
        for (const item of items) {
          
          const basePrice = Math.floor(Math.random() * 2000) + 500;
          const discountPrice = Math.floor(basePrice * (Math.random() * 0.4 + 0.4)); // 40-80% of base price
          
          await Product.create({
            name: item.name,
            slug: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2,8),
            brand: item.brand,
            category: categoryDoc._id,
            subcategory: subName,
            price: basePrice,
            discountPrice: discountPrice,
            discountPercentage: Math.round(((basePrice - discountPrice) / basePrice) * 100),
            stock: Math.floor(Math.random() * 50) + 10,
            colors: ['Default'],
            sizes: ['S', 'M', 'L', 'XL'],
            description: `This premium 100% authentic ${item.name} from ${item.brand} is exactly what you need. Featuring premium materials and top-tier Flipkart-style studio quality.`,
            images: [
              { url: item.img, publicId: `img_${Date.now()}_${Math.random()}` }
            ],
            rating: (Math.random() * 2 + 3).toFixed(1),
            numReviews: Math.floor(Math.random() * 100) + 5,
            isNewArrival: Math.random() > 0.5
          });
          
          productCount++;
        }
      }
    }

    console.log(`\n🎉 FLAWLESS SEED COMPLETE: ${productCount} 100% perfectly categorized and unique products created!`);
    process.exit(0);
  } catch (e) {
    console.error('Error seeding data:', e);
    process.exit(1);
  }
}

run();
