import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import { sendResponse } from '../utils/apiResponse.js';
import { buildFilter, buildSearch, buildSort, getPagination, buildMeta } from '../utils/apiFeatures.js';

// @desc    Create (simulate) a payment for one of the current user's orders
// @route   POST /api/payments
// @access  Private
export const createPayment = asyncHandler(async (req, res) => {
  const { order: orderId, method } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'paid') {
    res.status(400);
    throw new Error('This order has already been paid');
  }

  // NOTE: no real payment gateway is wired up yet — this simulates an
  // instantly-successful charge so the rest of the platform (orders,
  // invoices, notifications) can be built and tested end-to-end. Swap the
  // body of this handler for a real gateway call (Stripe/Razorpay/etc.)
  // when one is integrated.
  const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

  const payment = await Payment.create({
    user: req.user._id,
    order: order._id,
    amount: order.totalAmount,
    currency: order.currency,
    method,
    status: 'completed',
    transactionId,
    paidAt: new Date(),
  });

  order.paymentStatus = 'paid';
  order.status = order.status === 'pending' ? 'active' : order.status;
  await order.save();

  await Notification.create({
    user: req.user._id,
    type: 'payment',
    title: 'Payment successful',
    message: `Your payment of ${payment.amount} ${payment.currency} for order ${order.orderNumber} was successful.`,
    link: `/orders/${order._id}`,
  });

  return sendResponse(res, { statusCode: 201, message: 'Payment completed successfully', data: { payment, order } });
});

// @desc    Get the current user's payments
// @route   GET /api/payments/my?status=&method=&search=&sortBy=&order=&page=&limit=
// @access  Private
export const getMyPayments = asyncHandler(async (req, res) => {
  const filter = {
    user: req.user._id,
    ...buildFilter(req.query, ['status', 'method']),
    ...buildSearch(req.query, ['transactionId']),
  };
  const sort = buildSort(req.query, { createdAt: -1 });
  const { page, limit, skip } = getPagination(req.query);

  const [payments, total] = await Promise.all([
    Payment.find(filter).populate('order', 'orderNumber').sort(sort).skip(skip).limit(limit),
    Payment.countDocuments(filter),
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: 'Payments fetched successfully',
    data: { payments },
    meta: buildMeta({ page, limit, total }),
  });
});

// @desc    Get all payments (admin)
// @route   GET /api/payments?status=&method=&user=&search=&sortBy=&order=&page=&limit=
// @access  Private/Admin
export const getAllPayments = asyncHandler(async (req, res) => {
  const filter = {
    ...buildFilter(req.query, ['status', 'method', 'user']),
    ...buildSearch(req.query, ['transactionId']),
  };
  const sort = buildSort(req.query, { createdAt: -1 });
  const { page, limit, skip } = getPagination(req.query);

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('user', 'name email')
      .populate('order', 'orderNumber orderItems utrNumber totalPrice shippingAddress')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(filter),
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: 'Payments fetched successfully',
    data: { payments },
    meta: buildMeta({ page, limit, total }),
  });
});

// @desc    Get a single payment (owner or admin)
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('order', 'orderNumber');

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  const isOwner = payment.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have access to this payment');
  }

  return sendResponse(res, { statusCode: 200, message: 'Payment fetched successfully', data: { payment } });
});

// @desc    Update a payment's status (e.g. issue a refund)
// @route   PATCH /api/payments/:id/status
// @access  Private/Admin
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  payment.status = status;
  await payment.save();

  if (status === 'refunded') {
    await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'refunded' });
  }

  await Notification.create({
    user: payment.user,
    type: 'payment',
    title: 'Payment status updated',
    message: `Your payment ${payment.transactionId} is now ${payment.status}.`,
  });

  return sendResponse(res, { statusCode: 200, message: 'Payment updated successfully', data: { payment } });
});
