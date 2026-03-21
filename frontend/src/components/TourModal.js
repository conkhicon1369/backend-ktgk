import React, { useState, useEffect } from 'react';

const REGIONS = ['Miền Nam', 'Miền Trung', 'Miền Bắc', 'Tây Nguyên', 'Biển Đảo', 'Liên Tuyến'];
const TRANSPORTS = ['Ôtô', 'Máy bay', 'Tàu hỏa', 'Ôtô - Tàu cao tốc'];

const empty = {
  name: '', price: '', durationDays: '', departure: 'TP.HCM',
  destination: '', region: 'Miền Nam', transport: 'Ôtô',
  slots: '', image: '', description: '',
  priceIncludes: '', priceExcludes: '',
  isHot: false, status: 'active'
};

export default function TourModal({ tour, onClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tour) {
      setForm({
        ...tour,
        price: tour.price || '',
        durationDays: tour.durationDays || '',
        slots: tour.slots || '',
        priceIncludes: Array.isArray(tour.priceIncludes) ? tour.priceIncludes.join('\n') : '',
        priceExcludes: Array.isArray(tour.priceExcludes) ? tour.priceExcludes.join('\n') : '',
      });
    } else {
      setForm(empty);
    }
  }, [tour]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.destination) {
      setError('Vui lòng nhập tên tour, giá và điểm đến');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        slots: Number(form.slots),
        priceIncludes: form.priceIncludes ? form.priceIncludes.split('\n').filter(Boolean) : [],
        priceExcludes: form.priceExcludes ? form.priceExcludes.split('\n').filter(Boolean) : [],
      };
      await onSave(payload);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{tour ? 'Chỉnh sửa tour' : 'Thêm tour mới'}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="modal-form">
            <div className="form-group full">
              <label>Tên tour *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Tour Đà Lạt 3N2Đ" />
            </div>
            <div className="form-group">
              <label>Điểm đến *</label>
              <input value={form.destination} onChange={e => set('destination', e.target.value)} placeholder="Đà Lạt" />
            </div>
            <div className="form-group">
              <label>Nơi khởi hành</label>
              <input value={form.departure} onChange={e => set('departure', e.target.value)} placeholder="TP.HCM" />
            </div>
            <div className="form-group">
              <label>Giá (VNĐ) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="2500000" />
            </div>
            <div className="form-group">
              <label>Số ngày</label>
              <input type="number" value={form.durationDays} onChange={e => set('durationDays', e.target.value)} placeholder="3" />
            </div>
            <div className="form-group">
              <label>Tổng số chỗ</label>
              <input type="number" value={form.slots} onChange={e => set('slots', e.target.value)} placeholder="20" />
            </div>
            <div className="form-group">
              <label>Khu vực</label>
              <select value={form.region} onChange={e => set('region', e.target.value)}>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Phương tiện</label>
              <select value={form.transport} onChange={e => set('transport', e.target.value)}>
                {TRANSPORTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ẩn</option>
              </select>
            </div>
            <div className="form-group" style={{ alignSelf: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', textTransform: 'none', letterSpacing: 0 }}>
                <input type="checkbox" checked={form.isHot} onChange={e => set('isHot', e.target.checked)} style={{ width: 16, height: 16 }} />
                🔥 Tour nổi bật (HOT)
              </label>
            </div>
            <div className="form-group full">
              <label>Ảnh đại diện (URL)</label>
              <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-group full">
              <label>Mô tả</label>
              <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical', fontFamily: 'var(--font-body)', padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: 8, outline: 'none' }} />
            </div>
            <div className="form-group">
              <label>Bao gồm (mỗi dòng 1 mục)</label>
              <textarea rows={4} value={form.priceIncludes} onChange={e => set('priceIncludes', e.target.value)} placeholder={"Xe du lịch\nKhách sạn 3 sao\nĂn uống"} style={{ resize: 'vertical', fontFamily: 'var(--font-body)', padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: 8, outline: 'none', fontSize: '0.88rem' }} />
            </div>
            <div className="form-group">
              <label>Không bao gồm (mỗi dòng 1 mục)</label>
              <textarea rows={4} value={form.priceExcludes} onChange={e => set('priceExcludes', e.target.value)} placeholder={"Chi phí cá nhân\nVAT"} style={{ resize: 'vertical', fontFamily: 'var(--font-body)', padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: 8, outline: 'none', fontSize: '0.88rem' }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Hủy</button>
          <button className="btn btn-gold" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Đang lưu...' : (tour ? '💾 Cập nhật' : '➕ Thêm tour')}
          </button>
        </div>
      </div>
    </div>
  );
}
