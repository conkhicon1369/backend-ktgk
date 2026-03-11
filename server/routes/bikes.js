const express = require("express");
const router = express.Router();

// GET /api/bikes - Lấy toàn bộ danh sách xe
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bikes = await db.collection("bikes").find({}).toArray();
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// GET /api/bikes/:id - Lấy thông tin 1 xe theo ID
router.get("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id);
    const bike = await db.collection("bikes").findOne({ _id: id });
    if (!bike) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }
    res.json(bike);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// PUT /api/bikes/:id/status - Cập nhật trạng thái xe
router.put("/:id/status", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const result = await db
      .collection("bikes")
      .updateOne({ _id: id }, { $set: { status } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;