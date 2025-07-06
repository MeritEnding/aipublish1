// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container container">
        <div className="footer-section about">
          <h3 className="footer-heading">AI PUBLISH</h3>
          <p className="footer-text">
            AI와 함께 만드는 당신의 첫 번째 책. 누구나 작가가 될 수 있는 세상을 꿈꿉니다.
          </p>
        </div>
        <div className="footer-section links">
          <h4 className="footer-subheading">Quick Links</h4>
          <ul>
            <li><a href="#" className="footer-link">이용약관</a></li>
            <li><a href="#" className="footer-link">개인정보처리방침</a></li>
            <li><a href="#" className="footer-link">고객센터</a></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h4 className="footer-subheading">Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="GitHub"><i className="fab fa-github"></i>🔗</a> {/* 임시 아이콘 */}
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i>▶️</a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i>📸</a>
          </div>
        </div>
      </div>
      <div className="footer-divider"></div>
      <div className="copyright text-center">
        &copy; {new Date().getFullYear()} KT AIVLE School. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;