import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTourById, createBooking } from '../services/api';

const fmt = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  const [booking, setBooking] = useState({ customerName: '', phone: '', email: '', quantity: 1, note: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState(null);

  useEffect(() => {
    getTourById(id)
      .then(r => setTour(r.data))
      .catch(() => navigate('/tours'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!booking.customerName || !booking.phone || !booking.email) {
      setBookingMsg({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }
    setBookingLoading(true);
    try {
      await createBooking({ tourId: id, ...booking, quantity: Number(booking.quantity) });
      setBookingMsg({ type: 'success', text: '🎉 Đặt tour thành công! Chúng tôi sẽ liên hệ bạn sớm.' });
      setBooking({ customerName: '', phone: '', email: '', quantity: 1, note: '' });
    } catch (e) {
      setBookingMsg({ type: 'error', text: e.response?.data?.message || 'Có lỗi xảy ra' });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!tour) return null;

  const allImages = [tour.image, ...(tour.images || [])].filter(Boolean);
  const available = tour.slots - tour.booked;
  const totalPrice = tour.price * Number(booking.quantity);

  return (
    <div>
      {/* HERO */}
      <div className="detail-hero">
        <img src={allImages[activeImg] || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200'} alt={tour.name} />
        <div className="detail-hero-overlay" />
      </div>

      {/* ALBUM THUMBNAILS */}
      {allImages.length > 1 && (
        <div style={{ background: 'var(--navy)', padding: '12px 0' }}>
          <div className="container" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setActiveImg(i)}
                style={{
                  width: 80, height: 56, objectFit: 'cover', borderRadius: 6, cursor: 'pointer',
                  border: i === activeImg ? '2px solid var(--gold)' : '2px solid transparent',
                  opacity: i === activeImg ? 1 : 0.6, transition: 'all 0.2s', flexShrink: 0
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <div className="detail-layout">
          {/* MAIN */}
          <div className="detail-main">
            <h1 className="detail-title">{tour.name}</h1>
            <div className="detail-meta">
              <div className="detail-meta-item">⏱ {tour.durationDays}N{tour.durationDays - 1}Đ</div>
              <div className="detail-meta-item">🚌 {tour.transport}</div>
              <div className="detail-meta-item">📍 {tour.departure} → {tour.destination}</div>
              <div className="detail-meta-item">👥 Còn {available} chỗ</div>
              <div className="detail-meta-item">⭐ {tour.rating} ({tour.reviewsCount} đánh giá)</div>
              {tour.isHot && <div className="detail-meta-item" style={{ background: 'var(--red)', color: 'white' }}>🔥 Tour HOT</div>}
            </div>

            {tour.description && (
              <div style={{ marginBottom: 32 }}>
                <h3 className="section-h3">Mô tả tour</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--gray-600)' }}>{tour.description}</p>
              </div>
            )}

            {tour.schedule?.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h3 className="section-h3">Lịch trình</h3>
                {tour.schedule.map(s => (
                  <div key={s.day} className="schedule-item">
                    <div className="schedule-day">N{s.day}</div>
                    <div className="schedule-content">
                      <h4>{s.title}</h4>
                      <p>{s.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(tour.priceIncludes?.length > 0 || tour.priceExcludes?.length > 0) && (
              <div style={{ marginBottom: 32 }}>
                <h3 className="section-h3">Dịch vụ bao gồm</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {tour.priceIncludes?.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 10, color: 'var(--green)' }}>✅ Bao gồm</div>
                      {tour.priceIncludes.map((item, i) => (
                        <div key={i} className="include-item"><span className="tick">✓</span>{item}</div>
                      ))}
                    </div>
                  )}
                  {tour.priceExcludes?.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 10, color: 'var(--red)' }}>❌ Không bao gồm</div>
                      {tour.priceExcludes.map((item, i) => (
                        <div key={i} className="include-item"><span className="cross">✗</span>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR - BOOKING */}
          <div className="detail-sidebar">
            <div style={{ marginBottom: 4, fontSize: '0.8rem', color: 'var(--gray-400)' }}>Giá từ</div>
            <div className="detail-price">{fmt(tour.price)}</div>
            <div className="detail-price-note">/ người</div>

            <hr style={{ margin: '20px 0', borderColor: 'var(--gray-200)' }} />

            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Đặt tour ngay</h4>

            {bookingMsg && (
              <div className={`alert alert-${bookingMsg.type}`}>{bookingMsg.text}</div>
            )}

            <div className="booking-form">
              <div className="form-group">
                <label>Họ tên *</label>
                <input value={booking.customerName} onChange={e => setBooking(b => ({ ...b, customerName: e.target.value }))} placeholder="Nguyễn Văn A" />
              </div>
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input value={booking.phone} onChange={e => setBooking(b => ({ ...b, phone: e.target.value }))} placeholder="0909123456" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={booking.email} onChange={e => setBooking(b => ({ ...b, email: e.target.value }))} placeholder="email@gmail.com" />
              </div>
              <div className="form-group">
                <label>Số người</label>
                <select value={booking.quantity} onChange={e => setBooking(b => ({ ...b, quantity: e.target.value }))}>
                  {Array.from({ length: Math.min(available, 10) }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} người</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <input value={booking.note} onChange={e => setBooking(b => ({ ...b, note: e.target.value }))} placeholder="Yêu cầu đặc biệt..." />
              </div>
            </div>

            <div className="total-price">{fmt(totalPrice)}</div>

            <button
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px' }}
              onClick={handleBook}
              disabled={bookingLoading || available === 0}
            >
              {available === 0 ? 'Hết chỗ' : bookingLoading ? '⏳ Đang đặt...' : '🎫 Đặt Tour Ngay'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 12, fontSize: '0.82rem', color: 'var(--gray-400)' }}>
              hoặc gọi hotline
            </div>
            <a href="tel:0919991150" style={{ display: 'block', textAlign: 'center', color: 'var(--navy)', fontWeight: 700, fontSize: '1.1rem' }}>
              📞 0919 991 150
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
