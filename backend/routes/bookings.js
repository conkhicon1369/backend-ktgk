const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const authMiddleware = require('../middleware/auth');

// POST /api/bookings - Đặt tour
router.post('/', async (req, res) => {
  try {
    const { tourId, customerName, phone, email, quantity, note } = req.body;

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour không tồn tại' });
    if (tour.slots - tour.booked < quantity) {
      return res.status(400).json({ message: 'Không đủ chỗ trống' });
    }

    const totalPrice = tour.price * quantity;
    const booking = new Booking({ tourId, customerName, phone, email, quantity, totalPrice, note });
    await booking.save();

    // Update booked count
    await Tour.findByIdAndUpdate(tourId, { $inc: { booked: quantity } });

    res.status(201).json({ message: 'Đặt tour thành công', booking });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/bookings - Admin xem tất cả booking
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .populate('tourId', 'name destination price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Booking.countDocuments(filter);
    res.json({ bookings, total });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// PUT /api/bookings/:id/status - Cập nhật trạng thái
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });
    res.json({ message: 'Cập nhật thành công', booking });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
