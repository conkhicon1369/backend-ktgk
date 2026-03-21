const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const tourRoutes = require('./routes/tours');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://demomongo:passworddemo@cluster0.bvy1owa.mongodb.net/tour_management?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected: tour_management'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tour Management API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});