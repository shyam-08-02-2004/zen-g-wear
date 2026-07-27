import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a local temp file (written by Multer) to Cloudinary, then removes
 * the local copy regardless of success or failure.
 * @param {string} filePath - path to the local temp file
 * @param {string} folder - Cloudinary folder to upload into
 * @returns {Promise<object>} Cloudinary upload result
 */
export const uploadToCloudinary = async (filePath, folder = 'zen-g-wear') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
    });
    return result;
  } finally {
    fs.unlink(filePath, () => {}); // best-effort cleanup of the temp file
  }
};

/**
 * Deletes an asset from Cloudinary by its public id.
 * @param {string} publicId
 * @param {string} resourceType - image | video | raw
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};
