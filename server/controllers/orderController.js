import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';

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
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
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
