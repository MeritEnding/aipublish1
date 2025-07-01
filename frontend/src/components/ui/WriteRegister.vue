<template>
  <div class="application-background">
    <v-container class="application-container">
      <v-scroll-y-transition appear>
        <v-card class="application-panel" flat>
          <v-card-text class="pa-md-10 pa-6">
            <div class="text-center mb-8">
              <v-icon color="primary" size="56" class="mb-4">mdi-feather</v-icon>
              <h1 class="text-h4 font-weight-bold">작가 등록 신청</h1>
              <p class="text-body-1 text-grey-darken-1 mt-2">AIPublish의 작가가 되어 당신의 이야기를 세상에 공유하세요.</p>
            </div>

            <v-form @submit.prevent="submitApplication">
              <div class="section-title">기본 정보</div>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    :model-value="user.name"
                    label="이름"
                    variant="outlined"
                    readonly
                    prepend-inner-icon="mdi-account-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    :model-value="user.email"
                    label="이메일"
                    variant="outlined"
                    readonly
                    prepend-inner-icon="mdi-email-outline"
                  ></v-text-field>
                </v-col>
              </v-row>
              
              <div class="section-title mt-6">작가 정보</div>
              <v-text-field
                v-model="form.penName"
                label="필명 (작가명)"
                placeholder="사용하실 필명을 입력해주세요."
                variant="outlined"
                prepend-inner-icon="mdi-pen"
                :rules="[rules.required]"
                class="mb-4"
              ></v-text-field>
              
              <v-textarea
                v-model="form.introduction"
                label="작가 소개"
                placeholder="자신에 대해 자유롭게 소개해주세요. (주요 관심사, 글쓰기 스타일 등)"
                variant="outlined"
                rows="5"
                counter
                :rules="[rules.required]"
                class="mb-4"
              ></v-textarea>

              <v-file-input
                v-model="form.portfolioFile"
                label="포트폴리오 첨부 (선택)"
                placeholder="자신을 보여줄 수 있는 글(PDF, DOCX)을 첨부해주세요."
                variant="outlined"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                accept=".pdf,.doc,.docx"
              ></v-file-input>
              <div class="text-caption text-grey ml-2 mb-6">최대 10MB까지 업로드 가능합니다.</div>
              
              <v-checkbox
                v-model="form.agreement"
                :rules="[rules.required]"
                label="제출된 정보는 작가 등록 심사를 위해서만 사용되는 것에 동의합니다."
              ></v-checkbox>

              <v-btn
                :loading="loading"
                :disabled="!isFormValid"
                type="submit"
                color="primary"
                size="x-large"
                block
                class="mt-6 submit-btn"
              >
                신청하기
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-scroll-y-transition>
    </v-container>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" location="top">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'AuthorApplication',
  data() {
    return {
      // 실제 앱에서는 로그인 상태(Vuex 등)에서 사용자 정보를 가져옵니다.
      user: {
        name: '이정훈',
        email: 'aivle.kim@example.com',
      },
      form: {
        penName: '',
        introduction: '',
        portfolioFile: null, // v-file-input은 배열을 반환하므로 단일 파일은 첫 번째 요소 사용
        agreement: false,
      },
      loading: false,
      snackbar: { show: false, text: '', color: 'success' },
      rules: {
        required: value => !!value || '필수 항목입니다.',
      },
    };
  },
  computed: {
    isFormValid() {
      // 필수 항목들이 모두 채워졌는지 검사
      return this.form.penName && this.form.introduction && this.form.agreement;
    },
  },
  methods: {
    async submitApplication() {
      if (!this.isFormValid) return;
      this.loading = true;

      // FormData를 사용하여 파일과 텍스트 데이터를 함께 전송
      const formData = new FormData();
      formData.append('penName', this.form.penName);
      formData.append('introduction', this.form.introduction);
      if (this.form.portfolioFile) {
        formData.append('portfolio', this.form.portfolioFile[0]);
      }
      
      console.log('Submitting Application:', {
        penName: this.form.penName,
        introduction: this.form.introduction,
        portfolio: this.form.portfolioFile ? this.form.portfolioFile[0].name : '없음'
      });

      // --- 실제 API 호출 시뮬레이션 ---
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.loading = false;
      
      this.showSnackbar('작가 등록 신청이 완료되었습니다. 관리자 검토 후 결과를 알려드립니다.');

      // 신청 완료 후 마이페이지 등으로 이동
      setTimeout(() => {
        this.$router.push('/mypage');
      }, 2000);
    },
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>

<style scoped>
.application-background {
  background-color: #f7f8fc;
  min-height: 100vh;
  padding: 48px 0;
}

.application-container {
  max-width: 800px;
}

.application-panel {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  color: #333;
}

/* 읽기 전용 필드 스타일 */
.v-text-field--readonly >>> .v-field__input {
  color: #777 !important;
}
.v-text-field--readonly >>> .v-field {
  background-color: #f5f5f5 !important;
}

.submit-btn {
  font-weight: 700;
  letter-spacing: 0.5px;
}
</style>