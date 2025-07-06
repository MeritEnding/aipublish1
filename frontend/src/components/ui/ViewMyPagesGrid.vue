<template>
  <v-container class="my-page-container pa-4 pa-md-8">
    <div v-if="loading" class="text-center pa-16">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-body-1">마이페이지 정보를 불러오는 중...</p>
    </div>
    
    <template v-else-if="isLoggedIn && user">
      <v-card class="profile-dashboard pa-4 pa-md-6 mb-8" flat>
        <v-row align="center">
          <v-col cols="12" md="auto" class="text-center">
            <v-avatar color="grey-lighten-2" size="100">
              <v-icon size="60">mdi-account-circle</v-icon>
            </v-avatar>
          </v-col>
          <v-col>
            <h2 class="text-h5 font-weight-bold">{{ user.name }}</h2>
            <p class="text-body-1 text-grey-darken-1">{{ user.email }}</p>
            <v-chip :color="user.isAdmin ? 'indigo' : 'teal'" class="mt-2" label small>
              {{ user.isAdmin ? '관리자' : '일반회원' }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card>

      <v-row>
        <v-col cols="12" md="6">
          <v-card flat class="pa-4">
            <v-card-title class="pa-0 pb-2">구독 정보</v-card-title>
            <v-card-text class="pa-0 text-h6">
              {{ user.subscription ? '구독 중' : '미구독' }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card flat class="pa-4">
            <v-card-title class="pa-0 pb-2">KT 고객 여부</v-card-title>
            <v-card-text class="pa-0 text-h6">
              {{ user.isKtCustomer ? 'KT 고객님' : '해당 없음' }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <div v-else class="text-center pa-16">
      <p>사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.</p>
      <v-btn to="/login" color="primary">로그인 페이지로 이동</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import { useUserStore } from '@/store/user';

export default {
  name: "MyPage",
  data: () => ({
    loading: true,
  }),
  computed: {
    // ✅ [수정] userView 대신 currentUser를 user라는 이름으로 매핑합니다.
    ...mapState(useUserStore, {
        isLoggedIn: 'isLoggedIn',
        user: 'currentUser',
    }),
  },
  methods: {
    async loadMyPageData() {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) {
        this.$router.push('/login');
        return;
      }
      try {
        await userStore.fetchUserView();
      } catch (error) {
        console.error("마이페이지 로딩 중 에러:", error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.loadMyPageData();
  },
};
</script>

<style scoped>
.my-page-container { background-color: #f7f8fc; min-height: 100vh; }
.profile-dashboard { border: 1px solid #e0e0e0 !important; background-color: white; border-radius: 12px; }
</style>