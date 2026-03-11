// frontend/src/pages/Checkout.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearRentalData } from '../redux/rentalSlice';
import axios from 'axios';

export default function Checkout() {
  const { selectedBike, duration, totalPrice } = useSelector(state => state.rental);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', cccd: '' });
  const [errors, setErrors] = useState({});

  // Validation [cite: 57-60]
  const validate = () => {
    let errs = {};
    if (!form.name.trim()) errs.name = "Họ tên không được để trống";
    if (!/^\d{10}$/.test(form.phone)) errs.phone = "Số điện thoại phải đúng 10 số";
    if (!/^\d{12}$/.test(form.cccd)) errs.cccd = "CCCD phải đủ 12 số";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Khi nhấn xác nhận thuê [cite: 61]
    if (!validate()) return;

    try {
      await axios.post('http://localhost:5000/api/checkout', {
        customerName: form.name,
        phone: form.phone,
        cccd: form.cccd,
        bikeId: selectedBike._id,
        duration,
        totalPrice
      });
      
      // Thông báo thành công và chuyển về trang chủ [cite: 65]
      alert("Thuê xe thành công!");
      dispatch(clearRentalData());
      navigate('/');
    } catch (err) {
      alert("Lỗi server");
    }
  };

  if (!selectedBike) return <p>Vui lòng chọn xe trước.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Thanh toán</h2>
      <p>Xe: {selectedBike.bikeName} | Thời gian: {duration} giờ</p>
      <h3>Tổng thanh toán: {totalPrice.toLocaleString('vi-VN')}đ</h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 300, gap: 10 }}>
        <input 
          placeholder="Họ tên" 
          onChange={e => setForm({...form, name: e.target.value})} 
        />
        {errors.name && <small style={{color: 'red'}}>{errors.name}</small>}

        <input 
          placeholder="Số điện thoại" 
          onChange={e => setForm({...form, phone: e.target.value})} 
        />
        {errors.phone && <small style={{color: 'red'}}>{errors.phone}</small>}

        <input 
          placeholder="CCCD" 
          onChange={e => setForm({...form, cccd: e.target.value})} 
        />
        {errors.cccd && <small style={{color: 'red'}}>{errors.cccd}</small>}

        <button type="submit">Xác nhận thuê</button>
      </form>
    </div>
  );
}