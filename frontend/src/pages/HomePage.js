import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotTours, getToursByRegion } from '../services/api';
import TourCard from '../components/TourCard';

const HEROES = [
  {
    bg: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400',
    label: 'Khám phá Việt Nam',
    title: 'Vẻ Đẹp Biển Đảo Kỳ Diệu',
    price: '2,500,000đ',
    desc: 'Hành trình trọn gói',
    region: 'Biển Đảo',
  },
  {
    bg: 'https://images.unsplash.com/photo-1552942434-ef95e8e1a8f9?w=1400',
    label: 'Tây Nguyên huyền bí',
    title: 'Đà Lạt – Thành Phố Ngàn Hoa',
    price: '1,800,000đ',
    desc: 'Tour 3N2Đ giá tốt nhất',
    region: 'Tây Nguyên',
  },
  {
    bg: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1400',
    label: 'Kỳ quan thiên nhiên',
    title: 'Vịnh Hạ Long Huyền Thoại',
    price: '4,200,000đ',
    desc: 'Khám phá kỳ quan thế giới',
    region: 'Miền Bắc',
  },
];

const REGIONS = ['Miền Nam', 'Miền Trung', 'Miền Bắc', 'Tây Nguyên', 'Biển Đảo', 'Liên Tuyến'];

export default function HomePage() {
  const navigate = useNavigate();
  const [heroIdx, setHeroIdx] = useState(0);
  const [hotTours, setHotTours] = useState([]);
  const [regionTours, setRegionTours] = useState({});
  const [activeRegion, setActiveRegion] = useState('Miền Nam');
  const [search, setSearch] = useState('');
  const [searchRegion, setSearchRegion] = useState('');

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HEROES.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    getHotTours().then(r => setHotTours(r.data)).catch(() => {});
    getToursByRegion().then(r => setRegionTours(r.data)).catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (searchRegion) params.set('region', searchRegion);
    navigate(`/tours?${params.toString()}`);
  };

  const hero = HEROES[heroIdx];

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        {HEROES.map((h, i) => (
          <div
            key={i}
            className={`hero-slide ${i === heroIdx ? 'active' : ''}`}
            style={{ backgroundImage: `url(${h.bg})` }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-label">{hero.label}</div>
          <h1 className="hero-title">{hero.title}</h1>
          <div className="hero-price">
            {hero.desc} – Chỉ từ <strong>{hero.price}</strong>
          </div>
          <button className="hero-btn" onClick={() => navigate(`/tours?region=${hero.region}`)}>
            Xem tour ngay →
          </button>
        </div>
        <div className="hero-dots">
          {HEROES.map((_, i) => (
            <button key={i} className={`hero-dot ${i === heroIdx ? 'active' : ''}`} onClick={() => setHeroIdx(i)} />
          ))}
        </div>
      </div>

      {/* SEARCH */}
      <div className="container">
        <div className="search-bar" style={{ marginTop: -32, position: 'relative', zIndex: 10 }}>
          <div className="search-field" style={{ flex: 2 }}>
            <label>🔍 Tìm kiếm tour</label>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Nhập điểm đến, tên tour..."
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="search-field">
            <label>🗺 Khu vực</label>
            <select value={searchRegion} onChange={e => setSearchRegion(e.target.value)}>
              <option value="">Tất cả</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button className="btn-search" onClick={handleSearch}>Tìm ngay</button>
        </div>
      </div>

      {/* HOT TOURS */}
      {hotTours.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🔥 Tour Nổi Bật</h2>
              <a href="/tours?isHot=true" className="section-link">Xem tất cả →</a>
            </div>
            <div className="tours-grid">
              {hotTours.slice(0, 4).map(t => <TourCard key={t._id} tour={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* REGION TOURS */}
      <section className="section" style={{ background: 'var(--gray-100)', paddingTop: 48 }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tour Theo Khu Vực</h2>
            <a href="/tours" className="section-link">Tất cả tour →</a>
          </div>
          <div className="region-tabs">
            {REGIONS.map(r => (
              <button
                key={r}
                className={`region-tab ${activeRegion === r ? 'active' : ''}`}
                onClick={() => setActiveRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>
          {regionTours[activeRegion]?.length > 0 ? (
            <>
              <div className="tours-grid">
                {regionTours[activeRegion].map(t => <TourCard key={t._id} tour={t} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button className="btn btn-primary" onClick={() => navigate(`/tours?region=${activeRegion}`)}>
                  Xem thêm tour {activeRegion}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="icon">🗺</div>
              <p>Chưa có tour khu vực {activeRegion}</p>
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 8 }}>Tại Sao Chọn Chúng Tôi?</h2>
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', marginBottom: 48 }}>Hơn 10 năm kinh nghiệm trong ngành du lịch</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
            {[
              { icon: '🏆', title: 'Uy tín hàng đầu', desc: 'Hơn 10.000 khách hàng hài lòng mỗi năm' },
              { icon: '💰', title: 'Giá tốt nhất', desc: 'Cam kết giá cạnh tranh, không phát sinh' },
              { icon: '🛡', title: 'An toàn tuyệt đối', desc: 'Bảo hiểm du lịch toàn diện cho mọi chuyến đi' },
              { icon: '📞', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center', padding: 32, background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
