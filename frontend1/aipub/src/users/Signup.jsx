// src/pages/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isKtCustomer, setIsKtCustomer] = useState(false);
  const [subscription, setSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

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
      const response = await axios.post('/users/registeruser', { // 프록시 설정 후 상대 경로 사용
        name: username,
        email: email,
        passwordHash: password,
        isKtCustomer: isKtCustomer,
        subscription: subscription,
        isAdmin: false,
      });

      console.log('회원가입 성공:', response.data);
      alert('회원가입이 성공적으로 완료되었습니다! 로그인 해주세요.');
      navigate('/login');

    } catch (err) {
      console.error('회원가입 오류:', err);
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(`회원가입 실패: ${err.response.data}`); // 백엔드 메시지가 string일 경우
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(`회원가입 실패: ${err.response.data.message}`);
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="signup-container">
        <h2 className="auth-title">회원가입</h2>
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="signup-username">사용자 이름</label>
            <input
              type="text"
              id="signup-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용할 이름을 입력하세요"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">이메일 주소</label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="유효한 이메일 주소를 입력하세요"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">비밀번호</label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="최소 6자 이상"
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <input
              type="password"
              id="confirm-password"
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
              id="is-kt-customer"
              checked={isKtCustomer}
              onChange={(e) => setIsKtCustomer(e.target.checked)}
            />
            <label htmlFor="is-kt-customer">KT 고객이신가요?</label>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="subscription"
              checked={subscription}
              onChange={(e) => setSubscription(e.target.checked)}
            />
            <label htmlFor="subscription">서비스 구독에 동의합니다.</label>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <div className="auth-footer">
          <p>이미 계정이 있으신가요? <Link to="/login" className="auth-link">로그인</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;