// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      // 1. 사용자 로그인 API 호출
      // package.json에 proxy 설정이 되어있다면 /api 접두사를 붙여야 합니다.
      const loginResponse = await axios.post('/users/login', { // <-- 경로 수정: /api 추가
        email: email,
        passwordHash: password,
      });

      const userDataFromLogin = loginResponse.data;

      // 2. 로그인 성공 후, 해당 사용자의 포인트 정보도 별도로 가져옴
      let pointBalance = 0;
      try {
        // 포인트 정보를 가져오는 API 호출
        // package.json에 proxy 설정이 되어있다면 /api 접두사를 붙여야 합니다.
        const pointResponse = await axios.get(`/users/${userDataFromLogin.id}/points`); // <-- 경로 수정: /api 추가
        pointBalance = pointResponse.data.balance;
      } catch (pointErr) {
        console.warn('포인트 정보 로딩 실패 (로그인 시):', pointErr);
        // 포인트 정보가 없거나 로딩 실패해도 로그인 자체는 진행
      }

      alert('로그인 성공!');

      // 3. AuthContext의 login 함수를 호출하여 전역 상태 및 localStorage 업데이트
      // 로그인 응답 데이터와 가져온 포인트 잔액을 함께 전달
      login({
        id: userDataFromLogin.id,
        name: userDataFromLogin.name,
        email: userDataFromLogin.email,
        isAdmin: userDataFromLogin.isAdmin,
        pointBalance: pointBalance, // <-- 가져온 포인트 잔액 추가
        // 백엔드 로그인 API 응답에 isKtCustomer, subscription 등 추가 정보가 있다면 여기에 추가하여 Context에 저장 가능
      });

      // 4. 메인 페이지로 이동
      navigate('/');
    } catch (err) {
      console.error('로그인 오류:', err);
      // 에러 메시지 처리
      if (err.response && err.response.status === 401) {
        setError('잘못된 이메일 또는 비밀번호입니다.');
      } else if (err.response && err.response.data) {
        const backendMessage = typeof err.response.data === 'string'
          ? err.response.data
          : (err.response.data.message || '알 수 없는 오류');
        setError(`로그인 실패: ${backendMessage}`);
      } else {
        setError('로그인 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
      }
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
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