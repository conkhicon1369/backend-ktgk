// frontend/src/pages/BikeDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRentalData } from '../redux/rentalSlice';
import axios from 'axios';

export default function BikeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bike, setBike] = useState(null);
  const [hours, setHours] = useState(1); // Form nhập số giờ [cite: 49]

  useEffect(() => {
    // Lấy thông tin dựa vào ID [cite: 48]
    axios.get(`http://localhost:5000/api/bikes/${id}`).then(res => setBike(res.data));
  }, [id]);

  if (!bike) return <p>Loading...</p>;

  // Logic tính tiền [cite: 51]
  const basePrice = bike.pricePerHour * hours;
  let discount = 0;
  
  if (hours > 12) discount = 0.2; // Giảm 20% [cite: 54]
  else if (hours > 6) discount = 0.1; // Giảm 10% [cite: 53]

  const discountAmount = basePrice * discount;
  const finalPrice = basePrice - discountAmount;

  const handleNext = () => {
    dispatch(setRentalData({ bike, duration: hours, totalPrice: finalPrice }));
    navigate('/checkout');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{bike.bikeName}</h2>
      <p>Đơn giá: {bike.pricePerHour.toLocaleString('vi-VN')}đ/giờ</p>
      
      <div>
        <label>Số giờ thuê: </label>
        <input type="number" min="1" value={hours} onChange={e => setHours(Number(e.target.value))} />
      </div>

      {/* Hiển thị mức giá giảm và tổng tiền [cite: 55] */}
      <div style={{ marginTop: 20, background: '#f5f5f5', padding: 15 }}>
        <p>Tạm tính: {basePrice.toLocaleString('vi-VN')}đ</p>
        <p>Giảm giá: -{discountAmount.toLocaleString('vi-VN')}đ</p>
        <h3>Tổng tiền: {finalPrice.toLocaleString('vi-VN')}đ</h3>
      </div>

      <button onClick={handleNext} style={{ marginTop: 15 }}>Tiếp tục</button>
    </div>
  );
}