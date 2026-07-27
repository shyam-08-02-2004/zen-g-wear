import fs from 'fs';
import { MongoClient } from 'mongodb';

const localUri = 'mongodb://127.0.0.1:27017/zen-g-wear';

async function exportDb() {
  const localClient = await MongoClient.connect(localUri);
  const db = localClient.db();
  
  const data = {};
  const collections = ['products', 'categories', 'users', 'reviews', 'orders'];
  
  for (const collName of collections) {
    const docs = await db.collection(collName).find({}).toArray();
    data[collName] = docs;
    console.log(`Exported ${docs.length} from ${collName}`);
  }
  
  fs.writeFileSync('db_export.json', JSON.stringify(data));
  console.log('Export complete! Wrote db_export.json');
  await localClient.close();
}

exportDb();
