// src/pages/MyPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyPage.css';
import Header from '../mainPage/Header';
import Footer from '../mainPage/Footer';
import { useAuth } from '../contexts/AuthContext';

const MyPage = () => {
  const { isLoggedIn, user, logout, updatePointBalance } = useAuth(); // updatePointBalance도 가져옴
  const [userDataDetails, setUserDataDetails] = useState(null); // 최신 유저 상세정보 (isKtCustomer, subscription 등)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndPoints = async () => {
      if (!isLoggedIn || !user || !user.id) {
        alert('로그인이 필요한 서비스입니다.');
        navigate('/login');
        return;
      }

      try {
        // 1. 사용자 상세 정보 조회 (Context의 user는 로그인 시점 정보이므로, 상세 정보는 다시 조회)
        // isKtCustomer, subscription 등 마이페이지에 필요한 추가 정보는 여기서 가져옵니다.
        const userDetailResponse = await axios.get(`/users/${user.id}/views`);
        setUserDataDetails(userDetailResponse.data);

        // 2. 사용자 포인트 정보 조회 (포인트는 AuthContext의 user.pointBalance로 최신화되므로, 선택적으로 호출)
        // MyPage 로딩 시점에 최신 포인트 잔액을 확실히 가져와 Context를 업데이트합니다.
        const pointResponse = await axios.get(`/users/${user.id}/points`);
        updatePointBalance(pointResponse.data.balance); // Context의 포인트 상태 업데이트

      } catch (err) {
        console.error('마이페이지 정보 로딩 오류:', err);
        if (err.response && err.response.status === 404) {
            setError('사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.');
            logout();
            navigate('/login');
        } else if (err.response && err.response.data && typeof err.response.data === 'string') {
            setError(`오류: ${err.response.data}`);
        } else if (err.response && err.response.data && err.response.data.message) {
            setError(`오류: ${err.response.data.message}`);
        } else {
            setError('사용자 정보를 불러오는 데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndPoints();
  }, [isLoggedIn, user?.id, navigate, logout, updatePointBalance]); // user.id를 종속성에 추가

  const handleLogoutClick = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="mypage-loading-wrapper">
        <Header />
        <main className="mypage-main-content">
          <div className="loading-spinner"></div>
          <p>사용자 정보를 불러오는 중입니다...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypage-error-wrapper">
        <Header />
        <main className="mypage-main-content">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate('/login')} className="submit-button">로그인 페이지로</button>
        </main>
        <Footer />
      </div>
    );
  }

  // user 객체가 Context에서 넘어왔으므로, 이곳에서 바로 사용합니다.
  if (!user || !userDataDetails) { // userDataDetails도 로드되어야 함
    return (
      <div className="mypage-error-wrapper">
        <Header />
        <main className="mypage-main-content">
          <p>사용자 정보를 불러올 수 없습니다. 다시 로그인 해주세요.</p>
          <button onClick={() => navigate('/login')} className="submit-button">로그인 페이지로</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mypage-page-wrapper">
      <Header />
      <main className="mypage-main-content">
        <div className="mypage-container">
          <h2 className="mypage-title">마이페이지</h2>

          <section className="user-info-section">
            <h3 className="section-heading">내 정보</h3>
            <div className="info-item">
              <span className="info-label">이름:</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">이메일:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">KT 고객:</span>
              <span className="info-value">{userDataDetails.isKtCustomer ? '예' : '아니오'}</span> {/* userDetailResponse 사용 */}
            </div>
            <div className="info-item">
              <span className="info-label">서비스 구독:</span>
              <span className="info-value">{userDataDetails.subscription ? '구독 중' : '미구독'}</span> {/* userDetailResponse 사용 */}
            </div>
            <div className="info-item">
              <span className="info-label">관리자 권한:</span>
              <span className="info-value">{user.isAdmin ? '예' : '아니오'}</span>
            </div>
          </section>

          <section className="point-info-section">
            <h3 className="section-heading">포인트 정보</h3>
            <div className="info-item">
              <span className="info-label">현재 잔액:</span>
              <span className="info-value">{user.pointBalance !== undefined ? `${user.pointBalance} 점` : '로딩 중...'}</span> {/* Context의 user.pointBalance 사용 */}
            </div>
          </section>

          <div className="mypage-actions">
            <button className="edit-profile-button">회원 정보 수정</button>
            <button onClick={handleLogoutClick} className="logout-button">로그아웃</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyPage;