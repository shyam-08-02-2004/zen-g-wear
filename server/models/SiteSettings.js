import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  popupEnabled: { type: Boolean, default: false },
  popupTitle: { type: String, default: 'Special Offer' },
  popupMessage: { type: String, default: 'Get 20% off on all orders today!' },
  popupImageUrl: { type: String, default: '' },
  popupLink: { type: String, default: '/shop' },
}, { timestamps: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
