import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zen-g-wear')
  .then(async () => {
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found, creating one...');
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@zen-g-wear.com',
        password: 'password123',
        role: 'admin',
        isEmailVerified: true
      });
      console.log('Created admin: admin@zen-g-wear.com / password123');
    } else {
      console.log(`Found existing admin: ${admin.email}`);
      admin.password = 'password123';
      await admin.save();
      console.log(`Password reset to: password123`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
