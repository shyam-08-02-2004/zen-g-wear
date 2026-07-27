import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      admin.email = 'zeng9755@gmail.com';
      admin.password = 'shyam@9755'; // The schema has a pre('save') hook that will hash this
      await admin.save();
      console.log('Admin credentials updated successfully!');
    } else {
      console.log('Admin user not found. Creating one...');
      await User.create({
        name: 'Admin',
        email: 'zeng9755@gmail.com',
        password: 'shyam@9755',
        role: 'admin'
      });
      console.log('Admin user created successfully!');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateAdmin();
