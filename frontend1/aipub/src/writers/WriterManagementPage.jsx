// src/pages/WriterManagementPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WriterManagementPage.css';
import Header from '../mainPage/Header';
import Footer from '../mainPage/Footer';
import { useAuth } from '../contexts/AuthContext'; // 로그인 상태 및 사용자 정보 가져오기

const WriterManagementPage = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [pendingWriters, setPendingWriters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false); // 승인/반려 버튼 로딩

  useEffect(() => {
    const fetchPendingWriters = async () => {
      // 1. 관리자 권한 확인
      if (!isLoggedIn || !user || !user.id || !user.isAdmin) {
        alert('관리자만 접근할 수 있는 페이지입니다.');
        navigate('/'); // 또는 로그인 페이지로 리디렉션
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        // API 명세: GET /admin/writers?adminId={userid}
        const response = await axios.get(`/admin/writers?adminId=${user.id}`);
        setPendingWriters(response.data);
      } catch (err) {
        console.error('작가 목록 불러오기 실패:', err);
        if (err.response && err.response.status === 403) {
          setError('접근 권한이 없습니다. 관리자만 이용할 수 있습니다.');
          alert('접근 권한이 없습니다.');
          navigate('/');
        } else if (err.response && err.response.data && typeof err.response.data === 'string') {
          setError(`오류: ${err.response.data}`);
        } else if (err.response && err.response.data && err.response.data.message) {
          setError(`오류: ${err.response.data.message}`);
        } else {
          setError('작가 신청 목록을 불러오는 데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingWriters();
  }, [isLoggedIn, user, navigate, actionLoading]); // actionLoading이 변경되면 목록 새로고침

  const handleChangeWriterStatus = async (writerId, status) => {
    // 1. 관리자 권한 다시 확인 (UI 버튼 클릭 시점에 혹시 모를 변경 대비)
    if (!user || !user.id || !user.isAdmin) {
      alert('관리자 권한이 없습니다.');
      navigate('/');
      return;
    }

    if (!window.confirm(`정말로 이 작가 신청을 "${status === 'APPROVED' ? '승인' : '반려'}"하시겠습니까?`)) {
      return;
    }

    setActionLoading(true); // 버튼 로딩 시작
    setError(''); // 이전 에러 초기화

    try {
      // API 명세: PATCH /admin/writers/{writerId}/status?adminId={userId}
      await axios.patch(`/admin/writers/${writerId}/status?adminId=${user.id}`, {
        status: status, // "APPROVED" 또는 "REJECTED"
      });

      alert(`작가 신청이 성공적으로 "${status === 'APPROVED' ? '승인' : '반려'}" 되었습니다.`);
      // 상태 변경 후 목록을 다시 불러와 업데이트
      // fetchPendingWriters()를 호출하기 위해 actionLoading 상태를 토글합니다.
      setActionLoading(false); // 로딩 종료 후 useEffect 트리거
      // (이 방법 대신 목록에서 해당 아이템을 직접 제거하는 방식으로 UI 업데이트를 최적화할 수도 있습니다.)
    } catch (err) {
      console.error(`작가 ${status} 처리 실패:`, err);
      if (err.response && err.response.status === 403) {
        setError('권한이 없습니다. 관리자만 작가 상태를 변경할 수 있습니다.');
      } else if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(`오류: ${err.response.data}`);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(`오류: ${err.response.data.message}`);
      } else {
        setError(`작가 ${status} 처리 중 오류가 발생했습니다.`);
      }
      setActionLoading(false); // 에러 시 로딩 종료
    }
  };

  if (isLoading) {
    return (
      <div className="management-page-wrapper loading">
        <Header />
        <main className="management-main-content">
          <div className="loading-spinner"></div>
          <p>작가 신청 목록을 불러오는 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="management-page-wrapper error">
        <Header />
        <main className="management-main-content">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate('/')} className="back-button">메인으로 돌아가기</button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !user.isAdmin) { // 관리자 권한 없는 경우
    return (
      <div className="management-page-wrapper error">
        <Header />
        <main className="management-main-content">
          <p className="error-message">관리자만 접근할 수 있는 페이지입니다.</p>
          <button onClick={() => navigate('/')} className="back-button">메인으로 돌아가기</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="management-page-wrapper">
      <Header />
      <main className="management-main-content">
        <div className="management-container">
          <h2 className="management-title">작가 신청 관리</h2>
          {pendingWriters.length === 0 ? (
            <p className="no-data-message">현재 승인 대기 중인 작가 신청이 없습니다.</p>
          ) : (
            <table className="writers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>소개글</th>
                  <th>신청일</th>
                  <th>상태</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {pendingWriters.map((writer) => (
                  <tr key={writer.userId}>
                    <td>{writer.userId}</td>
                    <td>{writer.name}</td>
                    <td>{writer.email}</td>
                    <td>{writer.bio.length > 50 ? writer.bio.substring(0, 50) + '...' : writer.bio}</td>
                    <td>{new Date(writer.createdAt).toLocaleDateString()}</td>
                    <td><span className={`status-badge ${writer.status.toLowerCase()}`}>{writer.status}</span></td>
                    <td>
                      <button
                        className="action-button approve-button"
                        onClick={() => handleChangeWriterStatus(writer.userId, 'APPROVED')}
                        disabled={actionLoading}
                      >
                        승인
                      </button>
                      <button
                        className="action-button reject-button"
                        onClick={() => handleChangeWriterStatus(writer.userId, 'REJECTED')}
                        disabled={actionLoading}
                      >
                        반려
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WriterManagementPage;