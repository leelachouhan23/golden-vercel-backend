const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId:   { type: String, required: true },

    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true, lowercase: true },
    address:   { type: String, required: true },
    phone:     { type: String, required: true },

    productId:   { type: Number, required: true },
    productName: { type: String, required: true },
    size:        { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: String },

    category: { type: String, default: 'Perfume' },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);