import mongoose from 'mongoose';

const PERMISSIONS = [
  'manage_users',
  'manage_roles',
  'manage_services',
  'manage_orders',
  'manage_invoices',
  'manage_payments',
  'manage_tickets',
  'manage_notifications',
  'manage_blogs',
  'manage_contact_messages',
  'view_reports',
];

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, 'Role name must be at least 2 characters'],
      maxlength: [40, 'Role name cannot exceed 40 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
      default: '',
    },
    permissions: {
      type: [String],
      enum: {
        values: PERMISSIONS,
        message: '{VALUE} is not a recognized permission',
      },
      default: [],
    },
    // System roles (e.g. 'user', 'admin') are seeded and cannot be deleted
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

roleSchema.index({ name: 1 }, { unique: true });

roleSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const AVAILABLE_PERMISSIONS = PERMISSIONS;

const Role = mongoose.model('Role', roleSchema);

export default Role;
