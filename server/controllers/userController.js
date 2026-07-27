import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { sendResponse } from '../utils/apiResponse.js';
import { buildFilter, buildSearch, buildSort, getPagination, buildMeta } from '../utils/apiFeatures.js';

// @desc    Get all users (paginated, filterable, searchable, sortable)
// @route   GET /api/users?role=&isActive=&search=&sortBy=&order=&page=&limit=
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const filter = {
    ...buildFilter(req.query, ['role', 'isActive', 'isEmailVerified']),
    ...buildSearch(req.query, ['name', 'email']),
  };
  const sort = buildSort(req.query, { createdAt: -1 });
  const { page, limit, skip } = getPagination(req.query);

  const [users, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: 'Users fetched successfully',
    data: { users },
    meta: buildMeta({ page, limit, total }),
  });
});

// @desc    Get single user by id
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'User fetched successfully', data: { user } });
});

// @desc    Update a user's role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'User role updated', data: { user } });
});

// @desc    Activate / deactivate a user account
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'User status updated', data: { user } });
});

// @desc    Permanently delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  return sendResponse(res, { statusCode: 200, message: 'User deleted successfully' });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  return sendResponse(res, {
    statusCode: 200,
    message: 'Wishlist fetched successfully',
    data: { wishlist: user.wishlist },
  });
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  
  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }
  
  return sendResponse(res, {
    statusCode: 200,
    message: 'Product added to wishlist',
    data: { wishlist: user.wishlist },
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  
  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();
  
  return sendResponse(res, {
    statusCode: 200,
    message: 'Product removed from wishlist',
    data: { wishlist: user.wishlist },
  });
});

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return sendResponse(res, {
    statusCode: 200,
    message: 'Addresses fetched successfully',
    data: { addresses: user.addresses },
  });
});

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
  const { name, street, city, state, country, zipCode, isDefault } = req.body;
  const user = await User.findById(req.user._id);
  
  if (isDefault) {
    user.addresses.forEach(addr => { addr.isDefault = false; });
  }
  
  user.addresses.push({ name, street, city, state, country, zipCode, isDefault: isDefault || user.addresses.length === 0 });
  await user.save();
  
  return sendResponse(res, {
    statusCode: 201,
    message: 'Address added successfully',
    data: { addresses: user.addresses },
  });
});

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user._id);
  
  user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
  if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  
  return sendResponse(res, {
    statusCode: 200,
    message: 'Address deleted',
    data: { addresses: user.addresses },
  });
});

// @desc    Set default address
// @route   PUT /api/users/addresses/:addressId/default
// @access  Private
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user._id);
  
  let found = false;
  user.addresses.forEach(addr => {
    if (addr._id.toString() === addressId) {
      addr.isDefault = true;
      found = true;
    } else {
      addr.isDefault = false;
    }
  });
  
  if (!found) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  await user.save();
  return sendResponse(res, {
    statusCode: 200,
    message: 'Default address updated',
    data: { addresses: user.addresses },
  });
});
