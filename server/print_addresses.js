import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const printAddresses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zen-g-wear');
    console.log('MongoDB Connected');

    const db = mongoose.connection.db;

    const users = await db.collection('users').find({}).toArray();
    users.forEach(u => {
      console.log(`User ${u.email}:`);
      if (u.addresses) {
        u.addresses.forEach(a => console.log(a));
      }
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

printAddresses();
