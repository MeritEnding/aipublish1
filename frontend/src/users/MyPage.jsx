// src/pages/MyPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import './MyPage.css';
import Header from '../mainPage/Header';
import Footer from '../mainPage/Footer';
import { useAuth } from '../contexts/AuthContext'; // useAuth 훅 임포트

const MyPage = () => {
  const { isLoggedIn, user, logout } = useAuth(); // isLoggedIn, user, logout 가져오기
  const [pointData, setPointData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndPoints = async () => {
      // Context의 isLoggedIn과 user 객체 활용
      if (!isLoggedIn || !user || !user.id) {
        alert('로그인이 필요한 서비스입니다.');
        navigate('/login');
        return;
      }

      try {
        // 1. 사용자 기본 정보는 이미 Context의 user 객체에 있으므로 다시 API 호출하지 않아도 됨
        // 단, 최신 정보를 원한다면 여기서 다시 호출할 수도 있습니다.
        // 현재는 user 객체가 이미 Context에 로드되어 있다고 가정하고 포인트만 가져오겠습니다.
        // 만약 사용자 정보도 API에서 항상 최신으로 가져오고 싶다면 아래 주석 풀고 사용:
        // const userResponse = await axios.get(`/api/users/${user.id}/views`);
        // setUserData(userResponse.data); // 이 경우 MyPage 컴포넌트 내의 userData state 필요

        // 2. 사용자 포인트 정보 조회
        const pointResponse = await api.get(`/users/${user.id}/points`);
        setPointData(pointResponse.data);
        console.log('Point Data:', pointResponse.data);

      } catch (err) {
        console.error('마이페이지 정보 로딩 오류:', err);
        if (err.response && err.response.status === 404) {
            setError('사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.');
            logout(); // 잘못된 세션 정보로 판단, 로그아웃 처리
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
  }, [isLoggedIn, user, navigate, logout]); // 의존성 배열에 Context 값 추가

  const handleLogoutClick = () => {
    logout(); // Context의 logout 함수 호출
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="mypage-loading-wrapper">
        <p>사용자 정보를 불러오는 중입니다...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypage-error-wrapper">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/login')} className="submit-button">로그인 페이지로</button>
      </div>
    );
  }

  // user 객체가 Context에서 넘어왔으므로, 이곳에서 바로 사용합니다.
  if (!user) { // isLoggedIn이 false인 경우 이미 리디렉션되겠지만, 안전하게 추가.
    return (
      <div className="mypage-error-wrapper">
        <p>사용자 정보를 불러올 수 없습니다. 다시 로그인 해주세요.</p>
        <button onClick={() => navigate('/login')} className="submit-button">로그인 페이지로</button>
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
              <span className="info-value">{user.name}</span> {/* Context user 사용 */}
            </div>
            <div className="info-item">
              <span className="info-label">이메일:</span>
              <span className="info-value">{user.email}</span> {/* Context user 사용 */}
            </div>
            {/* Context user 객체에 isKtCustomer, subscription이 없으므로, 필요하면 userResponse에서 가져와야 합니다.
                현재 Login.js에서는 isAdmin만 저장하고 있습니다. 모든 필드를 저장하도록 Login.js를 수정해야 합니다. */}
            <div className="info-item">
              <span className="info-label">KT 고객:</span>
              <span className="info-value">{user.isKtCustomer ? '예' : '아니오'}</span> {/* Context user 사용 (Login.js에서 추가 저장 필요) */}
            </div>
            <div className="info-item">
              <span className="info-label">서비스 구독:</span>
              <span className="info-value">{user.subscription ? '구독 중' : '미구독'}</span> {/* Context user 사용 (Login.js에서 추가 저장 필요) */}
            </div>
            <div className="info-item">
              <span className="info-label">관리자 권한:</span>
              <span className="info-value">{user.isAdmin ? '예' : '아니오'}</span> {/* Context user 사용 */}
            </div>
          </section>

          <section className="point-info-section">
            <h3 className="section-heading">포인트 정보</h3>
            <div className="info-item">
              <span className="info-label">현재 잔액:</span>
              <span className="info-value">{pointData ? `${pointData.balance} 점` : '로딩 중...'}</span>
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