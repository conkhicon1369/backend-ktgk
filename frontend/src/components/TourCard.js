import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatPrice = (n) =>
  new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function TourCard({ tour }) {
  const navigate = useNavigate();
  return (
    <div className="tour-card" onClick={() => navigate(`/tours/${tour._id}`)}>
      <div className="tour-card-img">
        <img
          src={tour.image || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600'}
          alt={tour.name}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600'; }}
        />
        {tour.isHot && <span className="badge-hot">🔥 HOT</span>}
        {tour.region && <span className="badge-region">{tour.region}</span>}
      </div>
      <div className="tour-card-body">
        <div className="tour-card-name">{tour.name}</div>
        <div className="tour-card-meta">
          <span className="meta-item"><span className="meta-icon">⏱</span>{tour.durationDays}N{tour.durationDays - 1}Đ</span>
          <span className="meta-item"><span className="meta-icon">🚌</span>{tour.transport || 'Ôtô'}</span>
          <span className="meta-item"><span className="meta-icon">📍</span>{tour.departure}</span>
        </div>
        <div className="tour-card-footer">
          <div>
            <div className="tour-price-label">Giá từ</div>
            <div className="tour-price">{formatPrice(tour.price)}</div>
          </div>
          <div className="tour-rating">
            <span className="star">★</span>
            <span>{tour.rating?.toFixed(1) || '4.5'}</span>
            <span style={{ color: 'var(--gray-400)' }}>({tour.reviewsCount || 0})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
