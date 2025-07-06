<template>
  <v-container class="billing-container">
    <div v-if="!isLoggedIn" class="text-center pa-16">
      <p>포인트 및 구독 정보를 보려면 로그인이 필요합니다.</p>
      <v-btn to="/login" color="primary">로그인 페이지로 이동</v-btn>
    </div>

    <div v-else-if="isLoading" class="text-center pa-16">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4">사용자 정보를 불러오는 중...</p>
    </div>

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card class="pa-4" flat>
          <v-card-title class="d-flex align-center">
            <v-icon color="amber" class="me-2">mdi-star-circle</v-icon>
            포인트 관리
          </v-card-title>
          <v-card-text>
            <p class="text-body-1">현재 보유 포인트</p>
            <p class="text-h3 font-weight-bold my-4">{{ balance.toLocaleString() }} P</p>
            <v-text-field
              v-model.number="chargeAmount"
              label="충전할 포인트"
              type="number"
              variant="outlined"
              :rules="[v => v > 0 || '0보다 큰 값을 입력하세요']"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="amber-darken-3" size="large" @click="handlePurchasePoints" :loading="isSubmitting">
              포인트 충전하기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4" flat>
          <v-card-title class="d-flex align-center">
            <v-icon color="green" class="me-2">mdi-calendar-check</v-icon>
            구독 관리
          </v-card-title>
          <v-card-text>
            <p class="text-body-1">현재 구독 상태</p>
            <p class="text-h3 font-weight-bold my-4">
              <v-chip :color="isSubscribed ? 'green' : 'grey'" class="px-4 py-2" style="height: auto;">
                {{ isSubscribed ? '구독 중' : '미구독' }}
              </v-chip>
            </p>
            <p class="text-grey">구독 시 모든 도서를 무제한으로 열람할 수 있습니다.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="!isSubscribed" block color="green" size="large" @click="handleActivate" :loading="isSubmitting">
              구독 시작하기
            </v-btn>
            <v-btn v-else block color="grey" size="large" @click="handleDeactivate" :loading="isSubmitting">
              구독 해지하기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top">{{ snackbar.text }}</v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import { useUserStore } from '@/store/userStore';
import axios from '@axios';

export default {
  name: "BillingPageDirect",
  data() {
    return {
      isLoading: true, // 페이지 전체 로딩 상태
      isSubmitting: false, // 버튼 클릭 시 로딩 상태
      balance: 0,
      isSubscribed: false,
      chargeAmount: 1000,
      snackbar: { show: false, text: '', color: 'success' },
    };
  },
  computed: {
    // 로그인 정보는 중앙 userStore에서 가져옵니다.
    ...mapState(useUserStore, ['isLoggedIn', 'currentUser as user']),
  },
  methods: {
    /**
     * 포인트와 구독 정보를 모두 불러오는 마스터 함수
     */
    async loadBillingData() {
      if (!this.user) return;
      this.isLoading = true;
      try {
        // 두 개의 API를 동시에 호출하여 더 빠르게 데이터를 가져옵니다.
        await Promise.all([
          this.fetchPointBalance(),
          this.fetchSubscriptionStatus()
        ]);
      } catch (error) {
        this.showSnackbar('데이터를 불러오는 중 오류가 발생했습니다.', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * [직접 호출] 포인트 잔액 조회
     */
    async fetchPointBalance() {
      try {
        const response = await axios.get(`/users/${this.user.id}/points`);
        this.balance = response.data.balance || 0;
      } catch (error) {
        console.error("포인트 잔액 조회 실패:", error);
        this.balance = 0; // 실패 시 0으로 초기화
      }
    },

    /**
     * [직접 호출] 구독 상태 조회
     */
    async fetchSubscriptionStatus() {
      try {
        const response = await axios.get(`/subscriptions/${this.user.id}/status`);
        this.isSubscribed = response.data;
      } catch (error) {
        console.error("구독 상태 조회 실패:", error);
        this.isSubscribed = false; // 실패 시 false로 초기화
      }
    },

    /**
     * [직접 호출] 포인트 구매
     */
    async handlePurchasePoints() {
      if (this.chargeAmount <= 0) return this.showSnackbar('충전할 포인트를 입력하세요.', 'warning');
      this.isSubmitting = true;
      try {
        await axios.post('/points/grant', { userId: this.user.id, amount: this.chargeAmount });
        await this.fetchPointBalance(); // 성공 후 잔액 새로고침
        this.showSnackbar('포인트가 충전되었습니다.', 'success');
      } catch (error) {
        this.showSnackbar('포인트 충전 중 오류 발생', 'error');
      } finally {
        this.isSubmitting = false;
      }
    },

    /**
     * [직접 호출] 구독 활성화
     */
    async handleActivate() {
      if (confirm("구독을 시작하시겠습니까?")) {
        this.isSubmitting = true;
        try {
          await axios.post(`/subscriptions/activate?userId=${this.user.id}`);
          await this.fetchSubscriptionStatus(); // 성공 후 상태 새로고침
          this.showSnackbar('구독이 활성화되었습니다.', 'success');
        } catch (error) {
          this.showSnackbar('구독 활성화 중 오류 발생', 'error');
        } finally {
          this.isSubmitting = false;
        }
      }
    },

    /**
     * [직접 호출] 구독 비활성화
     */
    async handleDeactivate() {
      if (confirm("정말로 구독을 해지하시겠습니까?")) {
        this.isSubmitting = true;
        try {
          await axios.post(`/subscriptions/deactivate?userId=${this.user.id}`);
          await this.fetchSubscriptionStatus(); // 성공 후 상태 새로고침
          this.showSnackbar('구독이 해지되었습니다.', 'info');
        } catch (error) {
          this.showSnackbar('구독 해지 중 오류 발생', 'error');
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    
    showSnackbar(text, color) {
      this.snackbar.text = text; this.snackbar.color = color; this.snackbar.show = true;
    },
  },
  created() {
    // 페이지가 생성될 때 로그인 여부를 확인하고 데이터를 불러옵니다.
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
      this.loadBillingData();
    } else {
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
.billing-container { max-width: 1200px; }
.v-card { border: 1px solid #e0e0e0; border-radius: 12px; }
</style>