import { MongoClient } from 'mongodb';
const hosts = [
  'ac-k4rm5ld-shard-00-00.cuhd2vv.mongodb.net:27017',
  'ac-k4rm5ld-shard-00-01.cuhd2vv.mongodb.net:27017',
  'ac-k4rm5ld-shard-00-02.cuhd2vv.mongodb.net:27017'
];

async function run() {
  for (const host of hosts) {
    try {
      const uri = `mongodb://dangiji6655_db_user:shyam9755@${host}/zen-g-wear?ssl=true&authSource=admin`;
      const client = await MongoClient.connect(uri, { directConnection: true });
      const db = client.db('zen-g-wear');
      const isMaster = await db.command({ isMaster: 1 });
      console.log(`${host} isPrimary:`, isMaster.ismaster);
      await client.close();
    } catch (err) {
      console.error(host, 'Error:', err.message);
    }
  }
}
run();
