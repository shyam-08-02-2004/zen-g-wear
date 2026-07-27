import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOne({ email: 'admin@zen-g-wear.com' }).select('+password');
    if (!user) {
      console.log('User not found in DB');
    } else {
      console.log('User found:', user.email);
      const isMatch = await user.matchPassword('password123');
      console.log('Password match:', isMatch);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
