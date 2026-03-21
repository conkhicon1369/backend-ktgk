import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTours } from '../services/api';
import TourCard from '../components/TourCard';

const REGIONS = ['Miền Nam', 'Miền Trung', 'Miền Bắc', 'Tây Nguyên', 'Biển Đảo', 'Liên Tuyến'];

export default function ToursPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sortBy };
      if (search) params.search = search;
      if (region) params.region = region;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (searchParams.get('isHot') === 'true') params.isHot = true;

      const res = await getTours(params);
      setTours(res.data.tours);
      setPagination(res.data.pagination);
    } catch { setTours([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTours(); }, [page, region, sortBy]);

  const handleSearch = () => { setPage(1); fetchTours(); };

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, alignItems: 'start' }}>
          {/* SIDEBAR FILTER */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', position: 'sticky', top: 88 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 20 }}>Bộ lọc</h3>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Tìm kiếm</label>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Điểm đến, tên tour..." onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Khu vực</label>
              <select value={region} onChange={e => { setRegion(e.target.value); setPage(1); }}>
                <option value="">Tất cả khu vực</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 8 }}>
              <label>Giá từ (VNĐ)</label>
              <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="500000" />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Đến</label>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="10000000" />
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Sắp xếp</label>
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
                <option value="createdAt">Mới nhất</option>
                <option value="price">Giá tăng dần</option>
                <option value="-price">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>

            <button className="btn btn-gold" style={{ width: '100%' }} onClick={handleSearch}>
              🔍 Tìm kiếm
            </button>
            <button
              className="btn btn-outline"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => { setSearch(''); setRegion(''); setMinPrice(''); setMaxPrice(''); setSortBy('createdAt'); setPage(1); }}
            >
              Xóa bộ lọc
            </button>
          </div>

          {/* MAIN */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className="section-title">
                {region ? `Tour ${region}` : 'Tất cả Tour'}
              </h2>
              <span style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>
                {pagination.total} tour được tìm thấy
              </span>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : tours.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <p>Không tìm thấy tour phù hợp</p>
                <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <>
                <div className="tours-grid">
                  {tours.map(t => <TourCard key={t._id} tour={t} />)}
                </div>
                {/* PAGINATION */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    <button className="page-btn" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
