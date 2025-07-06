import { defineStore } from 'pinia';
import axios from '@axios';

export const usePointStore = defineStore('point', {
  state: () => ({
    balance: 0,
    isSubscribed: false,
    isLoading: false,
  }),
  getters: {
    currentBalance: (state) => state.balance,
    subscriptionStatus: (state) => state.isSubscribed,
  },
  actions: {
    /**
     * 특정 사용자의 포인트 잔액을 조회합니다.
     */
    async fetchPointBalance(userId) {
      if (!userId) return;
      this.isLoading = true;
      try {
        // 백엔드의 GET /points/balance?userId={userId} API를 호출합니다.
        // 현재 백엔드 코드는 GET /users/{id}/points 이므로, 그에 맞춰 호출합니다.
        const response = await axios.get(`/users/${userId}/points`);
        this.balance = response.data.balance || 0;
      } catch (error) {
        console.error("포인트 잔액 조회 실패:", error);
        this.balance = 0;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 포인트를 구매(충전)합니다.
     */
    async purchasePoints(payload) { // payload: { userId, amount }
      this.isLoading = true;
      try {
        await axios.post('/points/grant', payload);
        // 성공 후, 잔액을 다시 불러와 화면을 갱신합니다.
        await this.fetchPointBalance(payload.userId);
      } catch (error) {
        console.error("포인트 구매 실패:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 특정 사용자의 구독 상태를 조회합니다.
     */
    async fetchSubscriptionStatus(userId) {
        if (!userId) return;
        try {
            const response = await axios.get(`/subscriptions/${userId}/status`);
            this.isSubscribed = response.data;
        } catch (error) {
            console.error("구독 상태 조회 실패:", error);
            this.isSubscribed = false;
        }
    },

    /**
     * 구독을 활성화합니다.
     */
    async activateSubscription(userId) {
      if (!userId) return;
      await axios.post(`/subscriptions/activate?userId=${userId}`);
      // 성공 후, 상태를 다시 불러와 갱신
      await this.fetchSubscriptionStatus(userId);
    },

    /**
     * 구독을 비활성화합니다.
     */
    async deactivateSubscription(userId) {
      if (!userId) return;
      await axios.post(`/subscriptions/deactivate?userId=${userId}`);
      // 성공 후, 상태를 다시 불러와 갱신
      await this.fetchSubscriptionStatus(userId);
    },
  },
});