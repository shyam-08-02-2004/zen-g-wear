import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import supportTicketRoutes from './routes/supportTicketRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Security & core middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.post('/api/import-data', async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    const { Types } = mongoose;
    const data = req.body;
    for (const [collName, docs] of Object.entries(data)) {
      if (docs && docs.length > 0) {
        docs.forEach(doc => {
          if (doc._id && typeof doc._id === 'string' && doc._id.length === 24) doc._id = new Types.ObjectId(doc._id);
          if (doc.category && typeof doc.category === 'string' && doc.category.length === 24) doc.category = new Types.ObjectId(doc.category);
          if (doc.user && typeof doc.user === 'string' && doc.user.length === 24) doc.user = new Types.ObjectId(doc.user);
          if (doc.product && typeof doc.product === 'string' && doc.product.length === 24) doc.product = new Types.ObjectId(doc.product);
          if (doc.orderItems) {
            doc.orderItems.forEach(item => {
              if (item.product && typeof item.product === 'string' && item.product.length === 24) item.product = new Types.ObjectId(item.product);
            });
          }
        });
        const collection = mongoose.connection.collection(collName);
        await collection.deleteMany({});
        await collection.insertMany(docs);
      }
    }
    res.json({ success: true, message: 'Data imported!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Static folder for temporary uploads
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Zen-G Wear API is running' });
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', supportTicketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/questions', questionRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Zen-G Wear server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Export for Vercel Serverless
export default app;
