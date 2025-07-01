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
            label="아이디"
            type="Id"
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

          <div class="d-flex justify-end mt-2 mb-8">
            <a href="#" class="text-body-2 text-primary font-weight-medium text-decoration-none">
              비밀번호를 잊으셨나요?
            </a>
          </div>

          <v-btn
            :loading="loading"
            type="submit"
            color="primary"
            size="x-large"
            block
            class="login-button"
          >
            로그인
          </v-btn>
        </v-form>

        <v-divider class="my-8">또는</v-divider>

        <div class="social-login">
          <v-btn variant="outlined" class="social-btn" block>
            <v-icon left>mdi-google</v-icon>
            Google 계정으로 로그인
          </v-btn>
           <v-btn variant="outlined" class="social-btn mt-4" block>
            <v-icon left>mdi-chat-processing</v-icon>
            카카오 계정으로 로그인
          </v-btn>
        </div>

        <p class="text-center text-body-2 mt-8">
          계정이 없으신가요? 
          <a href="#/register" class="font-weight-bold text-primary text-decoration-none">회원가입</a>
        </p>
      </v-sheet>
    </div>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data: () => ({
    form: {
      email: '',
      password: '',
    },
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

      try {
        const response = await axios.get('/users');
        const users = response.data._embedded.users;
        
        const foundUser = users.find(user => 
          user.email === this.form.email && user.passwordHash === this.form.password
        );

        if (foundUser) {
          // ✅ 핵심: 로그인 성공 시 사용자 정보를 localStorage에 저장합니다.
          const userUrl = foundUser._links.self.href;
          const userId = userUrl.split('/').pop();

          localStorage.setItem('authToken', `dummy-token-for-${foundUser.email}`);
          localStorage.setItem('userName', foundUser.name);
          localStorage.setItem('userId', userId); // 마이페이지가 사용할 userId 저장

          alert(`${foundUser.name}님, 로그인에 성공했습니다.`);
          this.$router.push('/');

        } else {
          alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        }

      } catch (error) {
        console.error("Login Error:", error);
        alert('로그인 중 문제가 발생했습니다. API 주소와 서버 상태를 확인해주세요.');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}
.left-pane {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  color: white;
}
.left-pane .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.left-pane .brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  animation: fadeIn 1.5s ease-in-out;
}
.right-pane {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.login-form-sheet {
  width: 100%;
  padding: 24px;
  background: transparent;
  animation: fadeInUp 1s ease-in-out;
}
.login-button {
  font-weight: 700;
  letter-spacing: 0.5px;
}
.social-login .social-btn {
  border-color: #e0e0e0;
  color: #555;
  font-weight: 500;
}
@media (max-width: 960px) {
  .left-pane {
    display: none;
  }
  .right-pane {
    flex-basis: 100%;
  }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>