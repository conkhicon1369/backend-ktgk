// frontend/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [bikes, setBikes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    // API tự động lọc Available và Pin > 15% [cite: 43]
    axios.get('http://localhost:5000/api/bikes').then(res => setBikes(res.data));
  }, []);

  // Lọc theo loại xe và tìm kiếm theo tên [cite: 42, 44]
  const displayedBikes = bikes.filter(bike => {
    const matchType = filterType === 'All' || bike.category === filterType;
    const matchSearch = bike.bikeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách xe điện</h2>
      <div style={{ marginBottom: 20 }}>
        <input 
          placeholder="Tìm tên xe..." 
          onChange={e => setSearchTerm(e.target.value)} 
        />
        <select onChange={e => setFilterType(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="All">Tất cả</option>
          <option value="Xe máy điện">Xe máy điện</option>
          <option value="Xe đạp điện">Xe đạp điện</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {displayedBikes.map(bike => (
          <div key={bike._id} style={{ border: '1px solid #ccc', padding: 15, width: 250 }}>
            {/* Hiển thị Card [cite: 38] */}
            <h3>{bike.bikeName}</h3>
            <p>Loại: {bike.category}</p>
            {/* Định dạng tiền tệ VNĐ [cite: 41] */}
            <p>Giá: {bike.pricePerHour.toLocaleString('vi-VN')}đ/giờ</p>
            
            {/* Progress Bar Pin [cite: 40] */}
            <div style={{ width: '100%', backgroundColor: '#eee', height: 10 }}>
              <div style={{ 
                width: `${bike.battery}%`, 
                height: '100%', 
                backgroundColor: bike.battery < 20 ? 'red' : 'green' 
              }}></div>
            </div>
            <p style={{ fontSize: 12 }}>Pin: {bike.battery}%</p>
            
            <Link to={`/bike-detail/${bike._id}`}>
              <button>Thuê xe</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}