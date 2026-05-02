const mongoose = require('mongoose');

// Contact form submission schema — stored in MongoDB
const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, maxlength: 100 },
    email:   { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, maxlength: 200, default: 'General Enquiry' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status:  { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    ip:      { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
