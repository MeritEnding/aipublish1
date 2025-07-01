<template>
  <v-layout class="signup-layout">
    <div class="left-pane">
      <div class="overlay"></div>
      <div class="brand-content">
        <v-icon size="64" class="mb-4">mdi-book-open-page-variant-outline</v-icon>
        <h1 class="text-h3 font-weight-bold">AI Publish</h1>
        <p class="mt-4 text-h6 font-weight-light">AI와 함께, 당신의 이야기가 책이 되는 공간</p>
      </div>
    </div>

    <div class="right-pane">
      <v-sheet class="signup-form-sheet" max-width="400">
        <h2 class="text-h4 font-weight-bold mb-2">회원가입</h2>
        <p class="text-body-1 text-grey-darken-1 mb-8">AI Publish에 오신 것을 환영합니다.</p>

        <v-form @submit.prevent="handleSignUp">
          <v-text-field
            v-model="form.name"
            label="이름"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            class="mb-4"
            :rules="[rules.required]"
          ></v-text-field>
          
          <v-text-field
            v-model="form.email"
            label="이메일"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            class="mb-4"
            :rules="[rules.required, rules.email]"
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
            :rules="[rules.required]"
          ></v-text-field>

          <v-text-field
            v-model="form.passwordConfirm"
            label="비밀번호 확인"
            :type="isPasswordConfirmVisible ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock-check-outline"
            :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
            :rules="[rules.required, rules.passwordConfirm]"
          ></v-text-field>
          
          <v-divider class="my-6"></v-divider>

          <div class="agreements">
            <v-checkbox v-model="agreements.all" label="전체 동의" density="compact"></v-checkbox>
            <v-checkbox v-model="agreements.terms" label="이용약관 동의 (필수)" density="compact" :rules="[rules.required]"></v-checkbox>
            <v-checkbox v-model="agreements.privacy" label="개인정보처리방침 동의 (필수)" density="compact" :rules="[rules.required]"></v-checkbox>
          </div>

          <v-btn
            :loading="loading"
            :disabled="!isFormValid"
            type="submit"
            color="primary"
            size="x-large"
            block
            class="signup-button mt-6"
          >
            가입하기
          </v-btn>
        </v-form>

        <p class="text-center text-body-2 mt-8">
          이미 계정이 있으신가요? 
          <router-link to="/login" class="font-weight-bold text-primary text-decoration-none">로그인</router-link>
        </p>
      </v-sheet>
    </div>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUpPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
      agreements: {
        all: false,
        terms: false,
        privacy: false,
      },
      isPasswordVisible: false,
      isPasswordConfirmVisible: false,
      loading: false,
      rules: {
        required: value => !!value || '필수 항목입니다.',
        email: value => /.+@.+\..+/.test(value) || '유효한 이메일 형식이 아닙니다.',
        passwordConfirm: value => value === this.form.password || '비밀번호가 일치하지 않습니다.',
      },
    };
  },
  watch: {
    'agreements.all'(newValue) {
      this.agreements.terms = newValue;
      this.agreements.privacy = newValue;
    },
    'agreements.terms'(newValue) {
      if (!newValue) this.agreements.all = false;
      else if (this.agreements.privacy) this.agreements.all = true;
    },
    'agreements.privacy'(newValue) {
      if (!newValue) this.agreements.all = false;
      else if (this.agreements.terms) this.agreements.all = true;
    },
  },
  computed: {
    isFormValid() {
      return (
        this.form.name &&
        this.form.email &&
        /.+@.+\..+/.test(this.form.email) &&
        this.form.password &&
        this.form.password === this.form.passwordConfirm &&
        this.agreements.terms &&
        this.agreements.privacy
      );
    },
  },
  methods: {
    async handleSignUp() {
      if (!this.isFormValid) return;
      this.loading = true;
      
      try {
        const payload = {
          name: this.form.name,
          email: this.form.email,
          passwordHash: this.form.password, // 백엔드에 맞춰 필드명 전송
        };

        await axios.post('/users/registeruser', payload);

        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        this.$router.push('/login');

      } catch (error) {
        console.error("Sign Up Error:", error);
        if (error.response && error.response.status === 409) {
          alert('이미 가입된 이메일입니다.');
        } else {
          alert('회원가입 중 문제가 발생했습니다.');
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>
.signup-layout {
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
  overflow-y: auto;
  padding: 24px 0;
}
.signup-form-sheet {
  width: 100%;
  padding: 24px;
  background: transparent;
  animation: fadeInUp 1s ease-in-out;
}
.signup-button {
  font-weight: 700;
  letter-spacing: 0.5px;
}
.agreements {
  padding: 8px 12px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
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