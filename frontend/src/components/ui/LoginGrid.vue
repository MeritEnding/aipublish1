<template>
  <v-layout class="login-layout">
    <div class="left-pane">
      <div class="overlay"></div>
      <div class="brand-content">
        <v-icon size="64" class="mb-4">mdi-book-open-page-variant-outline</v-icon>
        <h1 class="text-h3 font-weight-bold">AI Publish</h1>
        <p class="mt-4 text-h6 font-weight-light">AI와 함께, 당신의 이야기가 책이 되는 공간</p>
      </div>
    </div>
    <div class="right-pane">
      <v-sheet class="login-form-sheet" max-width="400">
        <h2 class="text-h4 font-weight-bold mb-2">로그인</h2>
        <p class="text-body-1 text-grey-darken-1 mb-8">다시 오신 것을 환영합니다!</p>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="form.email"
            label="아이디 (이메일)"
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
          ></v-text-field>
          <v-btn :loading="loading" type="submit" color="primary" size="x-large" block class="mt-8">
            로그인
          </v-btn>
        </v-form>
        <p class="text-center text-body-2 mt-8">
          계정이 없으신가요? 
          <router-link to="/register" class="font-weight-bold text-primary text-decoration-none">회원가입</router-link>
        </p>
      </v-sheet>
    </div>
  </v-layout>
</template>

<script>
import { useUserStore } from '@/store/user';

export default {
  name: 'LoginPage',
  data: () => ({
    form: { email: '', password: '' },
    isPasswordVisible: false,
    loading: false,
  }),
  methods: {
    async handleLogin() {
      if (!this.form.email || !this.form.password) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
      }
      this.loading = true;
      const userStore = useUserStore();
      try {
        const payload = {
            email: this.form.email,
            passwordHash: this.form.password,
        };
        await userStore.login(payload);
        alert(`${userStore.currentUser.name}님, 로그인에 성공했습니다.`);
        this.$router.push('/'); // 로그인 후 메인 페이지로 이동
      } catch (error) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.login-layout { display: flex; height: 100vh; width: 100%; }
.left-pane { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; background-image: url('https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2070&auto=format&fit=crop'); background-size: cover; background-position: center; color: white; }
.left-pane .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); }
.left-pane .brand-content { position: relative; z-index: 1; text-align: center; }
.right-pane { flex: 1; display: flex; justify-content: center; align-items: center; background-color: #ffffff; }
.login-form-sheet { width: 100%; padding: 24px; max-width: 400px; }
@media (max-width: 960px) { .left-pane { display: none; } .right-pane { flex-basis: 100%; } }
</style>