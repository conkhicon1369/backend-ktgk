const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { _id: false });

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  durationDays: { type: Number, required: true, min: 1 },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  slots: { type: Number, required: true, min: 1 },
  booked: { type: Number, default: 0 },
  image: { type: String, default: '' },
  images: [{ type: String }],
  description: { type: String, default: '' },
  schedule: [scheduleSchema],
  priceIncludes: [{ type: String }],
  priceExcludes: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  isHot: { type: Boolean, default: false },
  transport: { type: String, default: 'Ôtô' },
  region: {
    type: String,
    enum: ['Miền Nam', 'Miền Trung', 'Miền Bắc', 'Tây Nguyên', 'Biển Đảo', 'Liên Tuyến'],
    default: 'Miền Nam'
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

// Virtual: available slots
tourSchema.virtual('available').get(function () {
  return this.slots - this.booked;
});

// Index for search
tourSchema.index({ name: 'text', destination: 'text', departure: 'text' });

module.exports = mongoose.model('Tour', tourSchema);
