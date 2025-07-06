// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../axios';
import './Login.css';
import { useAuth } from '../contexts/AuthContext'; // useAuth 훅 임포트

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // login 함수 가져오기

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/users/login', {
        email: email,
        passwordHash: password,
      });

      console.log('로그인 성공:', response.data);
      alert('로그인 성공!');

      // Context의 login 함수를 호출하여 전역 상태 및 localStorage 업데이트
      login({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        isAdmin: response.data.isAdmin,
      });

      navigate('/');
    } catch (err) {
      console.error('로그인 오류:', err);
      if (err.response && err.response.status === 401) {
        setError('잘못된 이메일 또는 비밀번호입니다.');
      } else if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(`로그인 실패: ${err.response.data}`);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(`로그인 실패: ${err.response.data.message}`);
      } else {
        setError('로그인 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... (이전과 동일한 JSX)
    <div className="auth-page-wrapper">
      <div className="login-container">
        <h2 className="auth-title">로그인</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className="auth-footer">
          <p>계정이 없으신가요? <Link to="/signup" className="auth-link">회원가입</Link></p>
          <p><Link to="/forgot-password" className="auth-link">비밀번호 찾기</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;