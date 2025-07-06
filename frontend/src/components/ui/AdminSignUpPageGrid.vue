<template>
  <v-layout class="signup-layout">
    <div class="right-pane">
      <v-sheet class="signup-form-sheet" max-width="400">
        <h2 class="text-h4 font-weight-bold mb-2">관리자 계정 생성</h2>
        <p class="text-body-1 text-grey-darken-1 mb-8">관리자 계정을 등록합니다.</p>
        <v-form @submit.prevent="handleAdminSignUp">
          <v-text-field
            v-model="form.name"
            label="이름"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            label="이메일"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            label="비밀번호"
            :type="isPasswordVisible ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            class="mb-4"
          ></v-text-field>
          <v-btn :loading="loading" type="submit" color="indigo" size="x-large" block class="mt-6">
            관리자 계정 생성
          </v-btn>
        </v-form>
      </v-sheet>
    </div>
  </v-layout>
</template>

<script>
import { useUserStore } from '@/store/user';

export default {
  name: 'AdminSignUpPage',
  data() {
    return {
      form: { name: '', email: '', password: '' },
      isPasswordVisible: false,
      loading: false,
    };
  },
  methods: {
    async handleAdminSignUp() {
      if (!this.form.name || !this.form.email || !this.form.password) {
        alert("모든 항목을 입력해주세요.");
        return;
      }
      this.loading = true;
      const userStore = useUserStore();
      
      const payload = {
        name: this.form.name,
        email: this.form.email,
        passwordHash: this.form.password,
        isKtCustomer: false,
        subscription: false,
        isAdmin: true, // ✅ [핵심] 관리자 플래그를 true로 고정하여 전송
      };

      try {
        await userStore.register(payload);
        alert('관리자 계정이 성공적으로 생성되었습니다. 로그인 페이지로 이동합니다.');
        this.$router.push('/login');
      } catch (error) {
        alert('관리자 계정 생성 중 문제가 발생했습니다.');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* SignUpPage와 동일한 스타일 사용 */
.signup-layout { display: flex; height: 100vh; width: 100%; }
.right-pane { flex: 1; display: flex; justify-content: center; align-items: center; background-color: #ffffff; }
.signup-form-sheet { width: 100%; padding: 24px; max-width: 400px; }
</style>