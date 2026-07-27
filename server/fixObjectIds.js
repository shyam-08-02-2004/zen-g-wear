import { MongoClient, ObjectId } from 'mongodb';

const cloudUri = 'mongodb://dangiji6655_db_user:shyam9755@ac-k4rm5ld-shard-00-02.cuhd2vv.mongodb.net:27017/zen-g-wear?ssl=true&authSource=admin';

async function run() {
  const client = await MongoClient.connect(cloudUri, { directConnection: true });
  const db = client.db('zen-g-wear');
  
  const collections = ['products', 'categories', 'users', 'reviews', 'orders'];
  
  for (const collName of collections) {
    const docs = await db.collection(collName).find({}).toArray();
    if (docs.length === 0) continue;
    
    const fixedDocs = docs.map(doc => {
      const newDoc = { ...doc };
      if (typeof newDoc._id === 'string' && newDoc._id.length === 24) newDoc._id = new ObjectId(newDoc._id);
      if (typeof newDoc.category === 'string' && newDoc.category.length === 24) newDoc.category = new ObjectId(newDoc.category);
      if (typeof newDoc.user === 'string' && newDoc.user.length === 24) newDoc.user = new ObjectId(newDoc.user);
      if (typeof newDoc.product === 'string' && newDoc.product.length === 24) newDoc.product = new ObjectId(newDoc.product);
      
      if (newDoc.orderItems) {
        newDoc.orderItems = newDoc.orderItems.map(item => {
          if (typeof item.product === 'string' && item.product.length === 24) {
            item.product = new ObjectId(item.product);
          }
          return item;
        });
      }
      return newDoc;
    });
    
    await db.collection(collName).drop().catch(() => {});
    await db.collection(collName).insertMany(fixedDocs);
    console.log(`Fixed ${fixedDocs.length} in ${collName}`);
  }
  
  console.log('All done!');
  await client.close();
}

run().catch(console.error);
