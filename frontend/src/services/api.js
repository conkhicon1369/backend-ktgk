import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Tour APIs
export const getTours = (params) => API.get('/tours', { params });
export const getTourById = (id) => API.get(`/tours/${id}`);
export const getHotTours = () => API.get('/tours/hot');
export const getToursByRegion = () => API.get('/tours/by-region');
export const createTour = (data) => API.post('/tours', data);
export const updateTour = (id, data) => API.put(`/tours/${id}`, data);
export const deleteTour = (id) => API.delete(`/tours/${id}`);

// Auth APIs
export const login = (data) => API.post('/auth/login', data);

// Booking APIs
export const createBooking = (data) => API.post('/bookings', data);
export const getBookings = (params) => API.get('/bookings', { params });
export const updateBookingStatus = (id, status) => API.put(`/bookings/${id}/status`, { status });

export default API;
