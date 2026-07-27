import { MongoClient } from 'mongodb';

const localUri = 'mongodb://127.0.0.1:27017/zen-g-wear';
const cloudUri = 'mongodb://dangiji6655_db_user:shyam9755@ac-k4rm5ld-shard-00-00.cuhd2vv.mongodb.net:27017,ac-k4rm5ld-shard-00-01.cuhd2vv.mongodb.net:27017,ac-k4rm5ld-shard-00-02.cuhd2vv.mongodb.net:27017/zen-g-wear?ssl=true&replicaSet=atlas-k4rm5ld-shard-0&authSource=admin&retryWrites=true&w=majority';

async function migrate() {
  let localClient, cloudClient;
  try {
    console.log('Connecting to local DB...');
    localClient = await MongoClient.connect(localUri);
    const localDb = localClient.db();

    console.log('Connecting to cloud DB...');
    cloudClient = await MongoClient.connect(cloudUri);
    const cloudDb = cloudClient.db();

    const collections = await localDb.listCollections().toArray();
    
    for (const collInfo of collections) {
      const collName = collInfo.name;
      console.log(`Migrating collection: ${collName}...`);
      const data = await localDb.collection(collName).find({}).toArray();
      
      if (data.length > 0) {
        // Clear cloud collection first
        await cloudDb.collection(collName).deleteMany({});
        // Insert data
        await cloudDb.collection(collName).insertMany(data);
        console.log(`-> Inserted ${data.length} documents into ${collName}`);
      } else {
        console.log(`-> Collection ${collName} is empty, skipping.`);
      }
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (localClient) await localClient.close();
    if (cloudClient) await cloudClient.close();
    process.exit(0);
  }
}

migrate();
