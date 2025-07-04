// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Provider 컴포넌트 생성
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 초기 로딩 시 localStorage에서 로그인 상태를 읽어옴
    return localStorage.getItem('userLoggedIn') === 'true';
  });
  const [user, setUser] = useState(() => {
    // 초기 로딩 시 localStorage에서 사용자 정보 (id, name, email, isAdmin)를 읽어옴
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // 문자열 "true"를 boolean으로 변환

    if (isLoggedIn && userId && userName && userEmail) {
      return { id: userId, name: userName, email: userEmail, isAdmin: isAdmin };
    }
    return null;
  });

  // 로그인 함수
  const login = (userData) => {
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('isAdmin', userData.isAdmin ? 'true' : 'false'); // boolean을 문자열로 저장
    setIsLoggedIn(true);
    setUser(userData);
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.clear(); // 모든 localStorage 데이터 삭제
    setIsLoggedIn(false);
    setUser(null);
  };

  // context value (제공할 상태와 함수)
  const authContextValue = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Context Hook 생성 (간편하게 Context 사용)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};