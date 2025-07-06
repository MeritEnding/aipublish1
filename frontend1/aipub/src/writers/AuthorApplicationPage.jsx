// src/pages/AuthorApplicationPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthorApplicationPage.css';
import Header from '../mainPage/Header';
import Footer from '../mainPage/Footer';
import { useAuth } from '../contexts/AuthContext'; // 로그인 상태 및 사용자 정보 가져오기

const AuthorApplicationPage = () => {
  const { isLoggedIn, user } = useAuth(); // Context에서 로그인 상태와 사용자 정보 가져옴
  const navigate = useNavigate();

  const [form, setForm] = useState({ introduction: '', agreement: false });
  const [applicationStatus, setApplicationStatus] = useState('NONE'); // NONE, PENDING, APPROVED, REJECTED
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태
  const [submitLoading, setSubmitLoading] = useState(false); // 신청 버튼 로딩 상태
  const [error, setError] = useState('');

  const isFormValid = form.introduction.length >= 20 && form.agreement; // 최소 20자 이상

  useEffect(() => {
    const checkUserAndApplicationStatus = async () => {
      // 1. 로그인 상태 확인
      if (!isLoggedIn || !user || !user.id) {
        alert('작가 신청은 로그인 후 이용 가능합니다.');
        navigate('/login');
        return;
      }

      // 2. 기존 신청 상태 확인
      try {
        const response = await axios.get(`/writer-candidates/${user.id}`); // userId로 신청 정보 조회
        if (response.status === 200 && response.data) {
          setApplicationStatus(response.data.status); // PENDING, APPROVED, REJECTED 등
        } else {
          setApplicationStatus('NONE'); // 신청 정보 없음
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setApplicationStatus('NONE'); // 404는 신청 정보가 없다는 의미
        } else {
          console.error('작가 신청 상태 확인 중 오류:', err);
          setError('작가 신청 상태를 불러오는 데 실패했습니다.');
          setApplicationStatus('ERROR'); // 오류 상태
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndApplicationStatus();
  }, [isLoggedIn, user, navigate]); // user, isLoggedIn 변경 시 다시 확인

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('작가 소개는 최소 20자 이상 작성해야 하며, 동의가 필요합니다.');
      return;
    }
    if (!user || !user.id || !user.name || !user.email) {
      setError('사용자 정보가 불완전합니다. 다시 로그인해주세요.');
      return;
    }

    setSubmitLoading(true);

    try {
      // API 명세: POST /writers/apply
      const response = await axios.post('/writers/apply', {
        userId: user.id,
        bio: form.introduction,
        // name, email은 백엔드에서 userClient.getUser를 통해 가져오므로 프론트에서 보낼 필요 없음
      });

      console.log('작가 신청 완료:', response.data);
      setApplicationStatus(response.data.status); // PENDING 상태로 업데이트될 것임
      alert('작가 신청이 성공적으로 제출되었습니다. 관리자 승인을 기다려주세요.');
      setForm({ introduction: '', agreement: false }); // 폼 초기화

    } catch (err) {
      console.error('작가 신청 실패:', err);
      if (err.response && err.response.status === 409) { // 409 Conflict: 이미 신청된 경우
        setError('이미 작가 신청이 완료되었거나 진행 중입니다.');
        // 상태를 강제로 PENDING으로 업데이트 (이미 신청되어 있을 가능성)
        setApplicationStatus('PENDING');
      } else if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(`신청 실패: ${err.response.data}`);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(`신청 실패: ${err.response.data.message}`);
      } else {
        setError('작가 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="application-page-wrapper loading">
        <Header />
        <main className="application-main-content">
          <div className="loading-spinner"></div>
          <p>작가 신청 상태를 불러오는 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="application-page-wrapper">
      <Header />
      <main className="application-main-content">
        <div className="application-container">
          {applicationStatus === 'APPROVED' && (
            <div className="status-message approved">
              <span className="status-icon">✅</span>
              <h1 className="status-title">작가 승인 완료</h1>
              <p>이제부터 작가로 활동하실 수 있습니다. 멋진 작품을 기대합니다!</p>
            </div>
          )}
          {applicationStatus === 'PENDING' && (
            <div className="status-message pending">
              <span className="status-icon">🕒</span>
              <h1 className="status-title">작가 신청 검토 중</h1>
              <p>관리자가 회원님의 신청서를 검토하고 있습니다. 최대 2~3영업일이 소요될 수 있습니다.</p>
            </div>
          )}
          {applicationStatus === 'REJECTED' && (
            <div className="status-message rejected">
              <span className="status-icon">❌</span>
              <h1 className="status-title">작가 신청 반려</h1>
              <p>제출하신 신청서가 반려되었습니다. 자세한 내용은 등록된 이메일로 안내됩니다.</p>
              <button className="reset-button" onClick={() => setApplicationStatus('NONE')}>다시 신청하기</button>
            </div>
          )}
          {applicationStatus === 'ERROR' && (
            <div className="status-message error">
              <span className="status-icon">⚠️</span>
              <h1 className="status-title">오류 발생</h1>
              <p>{error}</p>
              <button className="reset-button" onClick={() => navigate('/')}>메인으로 돌아가기</button>
            </div>
          )}
          {applicationStatus === 'NONE' && (
            <div className="application-form-section">
              <h1 className="auth-title">작가 등록 신청</h1>
              {error && <p className="error-message mb-4">{error}</p>}
              <form onSubmit={handleApplicationSubmit} className="auth-form">
                <div className="form-group">
                  <label>사용자 이름</label>
                  <input type="text" value={user?.name || ''} readOnly disabled />
                </div>
                <div className="form-group">
                  <label>이메일 주소</label>
                  <input type="email" value={user?.email || ''} readOnly disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="introduction">작가 소개 (최소 20자 이상)*</label>
                  <textarea
                    id="introduction"
                    value={form.introduction}
                    onChange={(e) => setForm({ ...form, introduction: e.target.value })}
                    placeholder="작가로서 자신을 소개해주세요. (예: 어떤 분야의 글을 쓰고 싶은지, 경력 등)"
                    rows="8"
                    required
                  ></textarea>
                </div>
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={form.agreement}
                    onChange={(e) => setForm({ ...form, agreement: e.target.checked })}
                    required
                  />
                  <label htmlFor="agreement">
                    본인은 제공하는 정보가 정확함을 확인하며, AI PUBLISH 작가 활동 약관에 동의합니다.
                  </label>
                </div>
                <button type="submit" className="submit-button" disabled={submitLoading || !isFormValid}>
                  {submitLoading ? '신청 중...' : '신청하기'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthorApplicationPage;