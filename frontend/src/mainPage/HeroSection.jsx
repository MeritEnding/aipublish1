// src/components/HeroSection.js
import React from 'react';
import './HeroSection.css';

const HeroSection = ({ title, imageUrl }) => {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h2 className="hero-title">{title}</h2>
        <p className="hero-subtitle">당신의 이야기를 책으로 만들어보세요.</p>
        <a href="/author/application" className="hero-button">작가 신청하기</a>
      </div>
    </section>
  );
};

export default HeroSection;