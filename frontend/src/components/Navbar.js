import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-contact">
            <span>📞 <a href="tel:0919991150">0919 991 150</a> – <a href="tel:0909532040">0909 532 040</a></span>
            <span>✉️ <a href="mailto:dulichhoanvu@gmail.com">dulichhoanvu@gmail.com</a></span>
            <span>💬 Zalo: 0919 991 150</span>
          </div>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>👤 {user.username}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.78rem' }}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            DU<span>LỊCH</span>HOÀN VŨ
          </Link>
          <div className="navbar-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Trang chủ</Link>
            <Link to="/tours" className={location.pathname.startsWith('/tours') ? 'active' : ''}>Tour</Link>
            <Link to="/tours?isHot=true">Bảng giá</Link>
            <Link to="/#about">Thông tin du lịch</Link>
            <Link to="/#contact">Liên hệ</Link>
            {user ? (
              <Link to="/admin" className="btn-admin">Quản trị</Link>
            ) : (
              <Link to="/login" className="btn-admin">Admin</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
