import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">DULỊCH HOÀN VŨ</div>
            <p className="footer-desc">
              Công ty TNHH Du Lịch và Tổ Chức Sự Kiện Hoàn Vũ<br />
              Địa chỉ: L17-11, Tầng 17, Tòa nhà Vincom Center,<br />
              Số 72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM
            </p>
            <a href="tel:0919991150" className="hotline">📞 0919 991 150</a>
          </div>
          <div>
            <div className="footer-title">Liên kết nhanh</div>
            <div className="footer-links">
              <Link to="/">Trang chủ</Link>
              <Link to="/tours">Tour du lịch</Link>
              <Link to="/tours?isHot=true">Bảng giá</Link>
              <Link to="/#contact">Liên hệ</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Khu vực tour</div>
            <div className="footer-links">
              <Link to="/tours?region=Miền Nam">Tour Miền Nam</Link>
              <Link to="/tours?region=Miền Trung">Tour Miền Trung</Link>
              <Link to="/tours?region=Miền Bắc">Tour Miền Bắc</Link>
              <Link to="/tours?region=Tây Nguyên">Tour Tây Nguyên</Link>
              <Link to="/tours?region=Biển Đảo">Tour Biển Đảo</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Du Lịch Hoàn Vũ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
