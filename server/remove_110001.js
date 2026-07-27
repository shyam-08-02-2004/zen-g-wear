import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const remove110001 = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('MongoDB Connected');

    const db = mongoose.connection.db;

    // Remove from Users addresses
    const usersUpdate = await db.collection('users').updateMany(
      {},
      { $pull: { addresses: { zipCode: '110001' } } }
    );
    
    const usersUpdate2 = await db.collection('users').updateMany(
      {},
      { $pull: { addresses: { street: { $regex: '110001' } } } }
    );
    
    console.log(`Updated ${usersUpdate.modifiedCount + usersUpdate2.modifiedCount} users to remove 110001 addresses.`);

    // Remove from Orders
    const ordersDelete = await db.collection('orders').deleteMany({
      'shippingAddress.postalCode': '110001'
    });
    
    const ordersDelete2 = await db.collection('orders').deleteMany({
      'shippingAddress.streetAddress': { $regex: '110001' }
    });

    console.log(`Deleted ${ordersDelete.deletedCount + ordersDelete2.deletedCount} orders with 110001 addresses.`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

remove110001();
