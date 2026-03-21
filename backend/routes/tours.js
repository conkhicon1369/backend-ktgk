const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const authMiddleware = require('../middleware/auth');

// GET /api/tours - Lấy danh sách tour với filter, search, pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      region,
      search,
      minPrice,
      maxPrice,
      isHot,
      status = 'active',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (region) filter.region = region;
    if (isHot !== undefined) filter.isHot = isHot === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { departure: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [tours, total] = await Promise.all([
      Tour.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      Tour.countDocuments(filter)
    ]);

    res.json({
      tours,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/tours/hot - Tour nổi bật
router.get('/hot', async (req, res) => {
  try {
    const tours = await Tour.find({ isHot: true, status: 'active' })
      .sort({ rating: -1 })
      .limit(6);
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/tours/by-region - Tour theo vùng
router.get('/by-region', async (req, res) => {
  try {
    const regions = ['Miền Nam', 'Miền Trung', 'Miền Bắc', 'Tây Nguyên', 'Biển Đảo', 'Liên Tuyến'];
    const result = {};
    for (const region of regions) {
      result[region] = await Tour.find({ region, status: 'active' })
        .sort({ isHot: -1 })
        .limit(5);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/tours/:id - Chi tiết tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Không tìm thấy tour' });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// POST /api/tours - Thêm tour mới (cần auth)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const tour = new Tour(req.body);
    await tour.save();
    res.status(201).json({ message: 'Tạo tour thành công', tour });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: err.errors });
    }
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// PUT /api/tours/:id - Cập nhật tour (cần auth)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!tour) return res.status(404).json({ message: 'Không tìm thấy tour' });
    res.json({ message: 'Cập nhật tour thành công', tour });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// DELETE /api/tours/:id - Xóa tour (cần auth)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Không tìm thấy tour' });
    res.json({ message: 'Xóa tour thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
