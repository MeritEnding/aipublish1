// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // axios 임포트

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Provider 컴포넌트 생성
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('userLoggedIn') === 'true';
  });
  const [user, setUser] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    const storedPointBalance = parseInt(localStorage.getItem('userPointBalance'), 10); // 포인트도 로드

    if (isLoggedIn && storedUserId && storedUserName && storedUserEmail) {
      return {
        id: storedUserId,
        name: storedUserName,
        email: storedUserEmail,
        isAdmin: storedIsAdmin,
        pointBalance: isNaN(storedPointBalance) ? 0 : storedPointBalance, // 포인트 기본값 0
      };
    }
    return null;
  });

  // 포인트 잔액만 업데이트하는 별도 함수
  const updatePointBalance = (newBalance) => {
    localStorage.setItem('userPointBalance', newBalance.toString());
    setUser(prevUser => prevUser ? { ...prevUser, pointBalance: newBalance } : null);
  };

  // 로그인 함수 (사용자 데이터와 초기 포인트 잔액을 함께 받음)
  const login = (userData) => {
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('isAdmin', userData.isAdmin ? 'true' : 'false');
    // 로그인 시 받아온 포인트 정보도 저장
    localStorage.setItem('userPointBalance', userData.pointBalance ? userData.pointBalance.toString() : '0');

    setIsLoggedIn(true);
    setUser(userData); // userData에는 pointBalance도 포함되어야 함
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
  };

  // context value
  const authContextValue = {
    isLoggedIn,
    user,
    login,
    logout,
    updatePointBalance, // 포인트 업데이트 함수 제공
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Context Hook 생성
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};