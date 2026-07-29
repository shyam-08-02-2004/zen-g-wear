import asyncHandler from 'express-async-handler';
import SiteSettings from '../models/SiteSettings.js';
import { sendResponse } from '../utils/apiResponse.js';

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  
  return sendResponse(res, {
    statusCode: 200,
    message: 'Settings fetched successfully',
    data: { settings },
  });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }

  const { popupEnabled, popupTitle, popupMessage, popupImageUrl, popupLink } = req.body;
  
  settings.popupEnabled = popupEnabled !== undefined ? popupEnabled : settings.popupEnabled;
  settings.popupTitle = popupTitle || settings.popupTitle;
  settings.popupMessage = popupMessage || settings.popupMessage;
  settings.popupImageUrl = popupImageUrl !== undefined ? popupImageUrl : settings.popupImageUrl;
  settings.popupLink = popupLink || settings.popupLink;

  await settings.save();

  return sendResponse(res, {
    statusCode: 200,
    message: 'Settings updated successfully',
    data: { settings },
  });
});
