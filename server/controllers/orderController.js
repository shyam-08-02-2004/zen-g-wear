import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    utrNumber,
    paymentRefCode,
    website_url, // Honeypot field
  } = req.body;

  // 0. Honeypot Bot Trap
  if (website_url) {
    // If a bot fills this hidden field, return fake success immediately
    return res.status(200).json({ success: true, data: { orderNumber: `ORD-${Date.now()}` } });
  }

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } 
  
  if (!utrNumber || utrNumber.trim().length !== 12) {
    res.status(400);
    throw new Error('A valid 12-digit UTR number is strictly required.');
  } else {
    // 1. Fake UTR Trap
    const fakePatterns = [/^(\d)\1{11}$/, /^123456789012$/, /^012345678912$/];
    if (utrNumber && fakePatterns.some(pattern => pattern.test(utrNumber))) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.isActive = false;
        await user.save({ validateBeforeSave: false });
        
        // Notify Admins
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
          await Notification.create({
            user: admin._id,
            type: 'system',
            title: 'User Banned (Fake UTR)',
            message: `User ${user.email} was automatically permanently banned for attempting to use a fake UTR (${utrNumber}).`,
            link: '/admin/users',
          });
        }
      }
      res.status(403);
      throw new Error('FAKE_UTR_BANNED');
    }

    // 2. UTR Uniqueness
    if (utrNumber) {
      const existingOrder = await Order.findOne({ utrNumber });
      if (existingOrder) {
        res.status(400);
        throw new Error('DUPLICATE_UTR');
      }
    }

    // 3. One Pending Order Limit (bypassed if trusted)
    const pastSuccessOrders = await Order.countDocuments({ 
      user: req.user._id, 
      status: { $in: ['processing', 'shipped', 'delivered'] } 
    });
    if (pastSuccessOrders === 0) {
      const pendingOrders = await Order.countDocuments({ 
        user: req.user._id, 
        status: 'pending' 
      });
      if (pendingOrders > 0) {
        res.status(400);
        throw new Error('PENDING_ORDER_LIMIT');
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      utrNumber,
      paymentRefCode,
    });

    const createdOrder = await order.save();

    const payment = new Payment({
      user: req.user._id,
      order: createdOrder._id,
      amount: totalPrice,
      method: paymentMethod === 'UPI' ? 'bank_transfer' : paymentMethod.toLowerCase(),
      currency: 'INR',
      status: 'pending',
      transactionId: (utrNumber ? utrNumber + '-' + Date.now().toString().slice(-4) : `TXN-${Date.now()}`)
    });
    
    try {
      await payment.save();
    } catch (err) {
      console.error("Payment save error:", err);
      // We don't want to crash the order creation if payment logging fails
    }

    res.status(201).json({ success: true, data: createdOrder });
  }
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json({ success: true, data: order });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  
  let query = { user: req.user._id };
  
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  if (req.query.search) {
    query.orderNumber = { $regex: req.query.search, $options: 'i' };
  }

  const count = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ 
    success: true, 
    data: { orders, page, pages: Math.ceil(count / pageSize) } 
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json({ success: true, data: orders });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to cancel this order');
    }
    if (order.status !== 'pending' && order.status !== 'processing') {
      res.status(400);
      throw new Error('Order cannot be cancelled at this stage');
    }
    order.status = 'cancelled';
    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const oldStatus = order.status;
    order.status = req.body.status || order.status;
    
    if (req.body.isPaid !== undefined) {
      order.isPaid = req.body.isPaid;
      if (req.body.isPaid && !order.paidAt) {
        order.paidAt = Date.now();
      }
    }
    
    const updatedOrder = await order.save();

    // 4. Stock Protection (reduce stock only on verification)
    if (req.body.status === 'processing' && oldStatus === 'pending') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.qty);
          await product.save({ validateBeforeSave: false });
        }
      }
    }

    if (req.body.status && req.body.status !== oldStatus) {
      await Notification.create({
        user: order.user,
        type: 'order',
        title: 'Order Status Updated',
        message: `Your order ${order.orderNumber || order._id.toString().slice(-8).toUpperCase()} is now ${req.body.status}.`,
        link: '/dashboard',
      });
    }

    res.json({ success: true, data: updatedOrder });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
