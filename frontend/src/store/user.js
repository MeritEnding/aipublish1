import { defineStore } from 'pinia';
import axios from '@axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    // ✅ user 상태 하나로 모든 정보를 통합 관리합니다.
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    currentUser: (state) => state.user,
  },
  actions: {
    async register(payload) {
      return axios.post('/users/registeruser', payload);
    },
    async login(credentials) {
      try {
        const response = await axios.post('/users/login', credentials);
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } catch (error) {
        this.logout();
        throw error;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },

    /**
     * ✅ [수정] 마이페이지 상세 정보를 기존 user state에 통합(병합)합니다.
     */
    async fetchUserView() {
      if (!this.user || !this.user.id) {
        console.error("마이페이지 조회 실패: 로그인된 사용자 ID가 없습니다.");
        return;
      }
      try {
        const response = await axios.get(`/users/${this.user.id}/views`);
        // 기존 user 정보에 서버에서 받은 상세 정보를 덮어씁니다.
        this.user = { ...this.user, ...response.data };
        // localStorage에도 최신 정보로 업데이트합니다.
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error("마이페이지 상세 정보 조회 실패:", error);
      }
    },
  },
});