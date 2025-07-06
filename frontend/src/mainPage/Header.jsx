// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../contexts/AuthContext'; // useAuth 훅 임포트

const Header = () => {
  const { isLoggedIn, logout } = useAuth(); // isLoggedIn 상태와 logout 함수 가져오기

  const handleLogoutClick = () => {
    logout(); // Context의 logout 함수 호출
    alert('로그아웃 되었습니다.');
    // navigate('/'); 또는 window.location.href = '/'; (이미 Context에서 localStorage를 지우고 상태 업데이트)
  };

  return (
    <header className="main-header">
      <div className="header-container container">
        <h1 className="logo">
          <Link to="/">AI PUBLISH</Link>
        </h1>
        <div className="search-bar">
          <input type="text" placeholder="검색어를 입력해주세요." />
          <i className="search-icon">🔍</i>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/book/explore">전체 도서</Link></li>
            <li><Link to="/author/application">작가 등록</Link></li>
            <li><Link to="/book/register">도서 등록</Link></li>
            {isLoggedIn && (
              <li><Link to="/mypage">마이페이지</Link></li>
            )}
            <li><Link to="/author/mangement">관리자</Link></li>

            {isLoggedIn ? (
              <li><button onClick={handleLogoutClick} className="nav-logout-btn">로그아웃</button></li>
            ) : (
              <li><Link to="/login">로그인</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;