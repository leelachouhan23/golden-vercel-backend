// ============================================================
// Golden River Perfume — Express Backend (FINAL ALL-IN-ONE)
// ============================================================
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const rateLimit  = require('express-rate-limit');
const nodemailer = require('nodemailer');

const contactRoutes = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

// ✅ trust proxy
app.set('trust proxy', 1);

// ─── Middleware ─────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// 🔥 Ignore React hot-update error
app.use((req, res, next) => {
  if (req.url.includes('hot-update')) {
    return res.status(204).end();
  }
  next();
});

// ─── CORS ─────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://golden-river-perfume.vercel.app', // Common pattern
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked for origin: ${origin}`);
      callback(null, true); // Allow all during troubleshooting, or keep the error
    }
  },
  credentials: true,
}));

// ─── Rate Limit ─────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// ─── MongoDB ─────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ─── ORDER SCHEMA ─────────────────────────
const orderSchema = new mongoose.Schema({
  orderId: String,
  name: String,
  email: String,
  address: String,
  phone: String,
  productId: Number,
  productName: String,
  size: String,
  price: Number,
  image: String,
  category: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// ─── EMAIL SETUP ─────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔥 Verify Email
transporter.verify((err) => {
  if (err) {
    console.error("❌ Email config error:", err.message);
  } else {
    console.log("📧 Email server ready");
  }
});

// ─── ROUTES ─────────────────────────

// ROOT
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API running 🚀' });
});

// HEALTH
app.get('/api/health', (req, res) => {
  res.json({ success: true });
});

// CONTACT
app.use('/api/contact', contactRoutes);

// ─── ORDER ROUTE (FULL WORKING) ─────────────────────────
app.post('/api/order', async (req, res) => {
  try {
    console.log("📥 Order Request:", req.body);

    const {
      name,
      email,
      address,
      phone,
      productName,
      price,
      size,
      image
    } = req.body;

    // 🔥 VALIDATION
    if (!name || !email || !productName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // 🔥 CREATE ORDER
    const orderData = {
      ...req.body,
      orderId: "GR-" + Date.now(),
    };

    const order = await Order.create(orderData);
    console.log("📦 Order Saved:", order.orderId);

    // 🔥 RESPONSE (Instant response to user)
    res.json({
      success: true,
      message: "Order placed successfully 🎉",
      order
    });

    // 🔥 SEND EMAIL ASYNC
    console.log("📧 Starting email send process...");
    transporter.sendMail({
      from: `"Golden River" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: "Order Confirmation — Golden River",
      html: `
        <div style="max-width:600px;margin:auto;font-family:Arial;padding:20px;">
          <h2>GOLDEN RIVER</h2>
          <p>Hello ${order.name},</p>
          <p>Your order has been placed successfully 🎉</p>
          <p>Order ID: ${order.orderId}</p>
          <p>Product: ${order.productName}</p>
          <p>Price: ₹${order.price}</p>
        </div>`
    }).then(() => {
      console.log("✅ Email sent successfully to:", order.email);
    }).catch(emailErr => {
      console.error("❌ Email failed:", emailErr.message);
      console.error("User Config - EMAIL_USER:", process.env.EMAIL_USER);
    });

  } catch (err) {
    console.error("❌ ORDER ERROR:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─── 404 ─────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── ERROR HANDLER ─────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false });
});

// ─── START SERVER ─────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});