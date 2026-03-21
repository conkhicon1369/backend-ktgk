import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTours, createTour, updateTour, deleteTour, getBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TourModal from '../components/TourModal';

const fmt = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tab, setTab] = useState('tours');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, hot: 0, booked: 0 });
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchTours();
  }, [user, page]);

  useEffect(() => {
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, status: undefined };
      if (search) params.search = search;
      const res = await getTours(params);
      setTours(res.data.tours);
      setPagination(res.data.pagination);
      const allRes = await getTours({ limit: 1000 });
      const all = allRes.data.tours;
      setStats({
        total: allRes.data.pagination.total,
        hot: all.filter(t => t.isHot).length,
        booked: all.reduce((s, t) => s + (t.booked || 0), 0),
      });
    } catch { }
    setLoading(false);
  };

  const fetchBookings = async () => {
    try {
      const res = await getBookings({ limit: 50 });
      setBookings(res.data.bookings);
    } catch { }
  };

  const handleSave = async (data) => {
    if (editTour) {
      await updateTour(editTour._id, data);
    } else {
      await createTour(data);
    }
    fetchTours();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa tour "${name}"?`)) return;
    await deleteTour(id);
    fetchTours();
  };

  const openAdd = () => { setEditTour(null); setModal(true); };
  const openEdit = (tour) => { setEditTour(tour); setModal(true); };

  const NAV = [
    { key: 'tours', icon: '🗺', label: 'Danh sách tour' },
    { key: 'bookings', icon: '📋', label: 'Đặt tour' },
  ];

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <div className="admin-logo">🌏 Hoàn Vũ Admin</div>
        <nav className="admin-nav">
          {NAV.map(n => (
            <button key={n.key} className={`admin-nav-item ${tab === n.key ? 'active' : ''}`} onClick={() => setTab(n.key)}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '12px 0' }} />
          <button className="admin-nav-item" onClick={() => navigate('/')}>
            <span>🏠</span>Trang chủ
          </button>
          <button className="admin-nav-item" onClick={() => { logout(); navigate('/'); }}>
            <span>🚪</span>Đăng xuất
          </button>
        </nav>
      </div>

      {/* MAIN */}
      <div className="admin-content">
        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Tổng tour</div>
          </div>
          <div className="stat-card" style={{ borderColor: '#e63946' }}>
            <div className="stat-number">{stats.hot}</div>
            <div className="stat-label">Tour HOT</div>
          </div>
          <div className="stat-card" style={{ borderColor: '#2d6a4f' }}>
            <div className="stat-number">{stats.booked}</div>
            <div className="stat-label">Lượt đặt</div>
          </div>
          <div className="stat-card" style={{ borderColor: '#1a3a6b' }}>
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Booking mới</div>
          </div>
        </div>

        {/* TOURS TAB */}
        {tab === 'tours' && (
          <div>
            <div className="admin-header">
              <h2 className="admin-title">Danh Sách Tour</h2>
              <button className="btn btn-gold" onClick={openAdd}>➕ Thêm tour mới</button>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <input
                className="form-group input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchTours()}
                placeholder="Tìm tour theo tên, điểm đến..."
                style={{ flex: 1, border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '9px 14px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
              />
              <button className="btn btn-primary" onClick={fetchTours}>🔍 Tìm</button>
            </div>

            <div className="table-wrapper">
              {loading ? (
                <div className="loading"><div className="spinner" /></div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tên tour</th>
                      <th>Điểm đến</th>
                      <th>Khu vực</th>
                      <th>Thời gian</th>
                      <th>Phương tiện</th>
                      <th>Giá</th>
                      <th>Chỗ trống</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tours.map(t => (
                      <tr key={t._id}>
                        <td>
                          <img
                            className="table-img"
                            src={t.image || 'https://via.placeholder.com/56x40'}
                            alt={t.name}
                            onError={e => { e.target.src = 'https://via.placeholder.com/56x40'; }}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, maxWidth: 180 }}>{t.name}</div>
                          {t.isHot && <span className="status-badge status-hot">🔥 HOT</span>}
                        </td>
                        <td>{t.destination}</td>
                        <td>{t.region}</td>
                        <td>{t.durationDays}N{t.durationDays - 1}Đ</td>
                        <td>{t.transport}</td>
                        <td style={{ color: 'var(--red)', fontWeight: 600 }}>{fmt(t.price)}</td>
                        <td>{t.slots - t.booked}/{t.slots}</td>
                        <td>
                          <span className={`status-badge ${t.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                            {t.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-sm btn-outline" onClick={() => openEdit(t)}>✏️ Sửa</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id, t.name)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tours.length === 0 && (
                      <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>Không có tour nào</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination" style={{ marginTop: 20 }}>
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>›</button>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div>
            <div className="admin-header">
              <h2 className="admin-title">Danh Sách Đặt Tour</h2>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Tour</th>
                    <th>SĐT</th>
                    <th>Email</th>
                    <th>Số người</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 600 }}>{b.customerName}</td>
                      <td style={{ maxWidth: 160 }}>{b.tourId?.name || 'N/A'}</td>
                      <td>{b.phone}</td>
                      <td>{b.email}</td>
                      <td style={{ textAlign: 'center' }}>{b.quantity}</td>
                      <td style={{ color: 'var(--red)', fontWeight: 600 }}>{fmt(b.totalPrice)}</td>
                      <td>
                        <span className={`status-badge ${b.status === 'confirmed' ? 'status-active' : b.status === 'cancelled' ? 'status-inactive' : 'status-hot'}`}>
                          {b.status === 'confirmed' ? '✅ Xác nhận' : b.status === 'cancelled' ? '❌ Hủy' : '⏳ Chờ'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>
                        {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>Chưa có đặt tour nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <TourModal
          tour={editTour}
          onClose={() => setModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
