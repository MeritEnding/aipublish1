// src/pages/AdminSignupPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminSignupPage.css'; // 전용 CSS 파일

const AdminSignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isKtCustomer, setIsKtCustomer] = useState(false); // 관리자도 KT 고객일 수 있으니 유지
  const [subscription, setSubscription] = useState(true);   // 관리자 계정은 기본적으로 구독으로 설정
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 클라이언트 측 유효성 검사 (일반 회원가입과 동일)
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }
    if (!username || !email || !password || !confirmPassword) {
      setError('모든 필수 필드를 채워주세요.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // 백엔드 API 호출: /users/registeruser
      // isAdmin 필드를 항상 true로 설정하여 전송
      const response = await axios.post('/users/registeruser', {
        name: username,
        email: email,
        passwordHash: password,
        isKtCustomer: isKtCustomer,
        subscription: subscription,
        isAdmin: true, // <-- 관리자 계정 생성이므로 항상 true
      });

      console.log('관리자 회원가입 성공:', response.data);
      alert('관리자 계정이 성공적으로 생성되었습니다! 로그인 해주세요.');
      navigate('/login'); // 회원가입 성공 후 로그인 페이지로 이동

    } catch (err) {
      console.error('관리자 회원가입 오류:', err);
      if (err.response && err.response.data) {
        const backendMessage = typeof err.response.data === 'string'
          ? err.response.data
          : (err.response.data.message || '알 수 없는 오류');
        setError(`관리자 회원가입 실패: ${backendMessage}`);
      } else {
        setError('관리자 회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="admin-signup-container">
        <h2 className="auth-title">관리자 계정 생성</h2>
        <p className="admin-signup-description">
          새로운 관리자 계정을 생성합니다.
          <br />
          이 페이지는 관리자 전용입니다.
        </p>
        <form onSubmit={handleAdminSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="admin-signup-username">사용자 이름</label>
            <input
              type="text"
              id="admin-signup-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="관리자 이름"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-signup-email">이메일 주소</label>
            <input
              type="email"
              id="admin-signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="관리자 이메일 주소"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-signup-password">비밀번호</label>
            <input
              type="password"
              id="admin-signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="최소 6자 이상"
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-confirm-password">비밀번호 확인</label>
            <input
              type="password"
              id="admin-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="admin-is-kt-customer"
              checked={isKtCustomer}
              onChange={(e) => setIsKtCustomer(e.target.checked)}
            />
            <label htmlFor="admin-is-kt-customer">KT 고객이신가요?</label>
          </div>

          {/* 관리자 계정은 기본적으로 구독하는 것으로 설정되므로 체크박스 표시 안 함
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="admin-subscription"
              checked={subscription}
              onChange={(e) => setSubscription(e.target.checked)}
            />
            <label htmlFor="admin-subscription">서비스 구독에 동의합니다.</label>
          </div>
          */}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '생성 중...' : '관리자 계정 생성'}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            <Link to="/login" className="auth-link">로그인 페이지로 돌아가기</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;