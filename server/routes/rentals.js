const express = require("express");
const router = express.Router();

// GET /api/rentals - Lấy toàn bộ lịch sử thuê xe (Admin)
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const rentals = await db
      .collection("rentals")
      .find({})
      .sort({ startTime: -1 })
      .toArray();
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// POST /api/rentals - Tạo mới một lần thuê xe
router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { customerName, phone, cccd, bikeId, duration, totalPrice } =
      req.body;

    const newRental = {
      customerName,
      phone,
      cccd,
      bikeId: parseInt(bikeId),
      startTime: new Date().toISOString(),
      duration: parseInt(duration),
      totalPrice: parseInt(totalPrice),
      status: "Completed",
    };

    const result = await db.collection("rentals").insertOne(newRental);
    res
      .status(201)
      .json({ message: "Thuê xe thành công!", rentalId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;