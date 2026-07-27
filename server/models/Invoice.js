import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [invoiceItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'An invoice must contain at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    status: {
      type: String,
      enum: ['draft', 'issued', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
      index: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      validate: {
        validator: function (value) {
          return value >= this.issuedDate;
        },
        message: 'Due date cannot be before the issued date',
      },
    },
    paidDate: {
      type: Date,
      default: null,
    },
    pdfUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate a human-readable, unique invoice number
invoiceSchema.pre('validate', function (next) {
  if (!this.invoiceNumber) {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.invoiceNumber = `INV-${Date.now()}-${random}`;
  }
  next();
});

invoiceSchema.index({ user: 1, status: 1 });

invoiceSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
