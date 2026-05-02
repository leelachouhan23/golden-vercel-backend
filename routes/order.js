const express = require('express');
const router = express.Router();

const Order = require('../models/Order');

// POST /api/order
router.post('/', async (req, res) => {
  try {
    console.log("📥 Order:", req.body);

    const order = new Order(req.body);
    await order.save();

    console.log("✅ Order saved");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
    });

  } catch (err) {
    console.error("❌ Order error:", err);
    res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
});

module.exports = router;