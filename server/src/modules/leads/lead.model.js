const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

leadSchema.index({ isDeleted: 1 });
leadSchema.index({ status: 1, isDeleted: 1 });
leadSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
