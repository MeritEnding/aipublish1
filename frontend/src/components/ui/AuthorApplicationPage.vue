<template>
  <div class="application-background">
    <v-container class="application-container">
      <div v-if="!isLoggedIn" class="text-center pa-16">
        <p>작가 신청을 위해 **로그인이 필요합니다.**</p>
        <v-btn to="/login" color="primary">로그인 하러 가기</v-btn>
      </div>
      <div v-else-if="isLoading" class="text-center pa-16">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4">정보를 불러오는 중입니다...</p>
      </div>
      <v-card v-else-if="user" class="application-panel" flat>
        <v-card-text class="pa-md-10 pa-6">
          <div v-if="applicationStatus === 'APPROVED'" class="text-center">
            <v-icon color="success" size="56">mdi-check-decagram</v-icon>
            <h1 class="text-h4 mt-4">작가 승인 완료</h1>
            <p>이제부터 작가로 활동하실 수 있습니다.</p>
            <v-btn class="mt-4" color="primary" @click="resetApplicationStatus">다시 신청하기 (테스트용)</v-btn>
          </div>
          <div v-else-if="applicationStatus === 'PENDING'" class="text-center">
            <v-icon color="info" size="56">mdi-clock-outline</v-icon>
            <h1 class="text-h4 mt-4">검토 중</h1>
            <p>관리자가 신청서를 검토하고 있습니다.</p>
            <p class="mt-2 text-caption">최대 2~3 영업일이 소요될 수 있습니다.</p>
            <v-btn class="mt-4" color="secondary" @click="resetApplicationStatus">상태 초기화 (테스트용)</v-btn>
          </div>
          <div v-else-if="applicationStatus === 'REJECTED'" class="text-center">
            <v-icon color="error" size="56">mdi-close-octagon-outline</v-icon>
            <h1 class="text-h4 mt-4">신청 반려</h1>
            <p>제출하신 신청서가 반려되었습니다. 자세한 내용은 이메일을 확인해주세요.</p>
            <v-btn class="mt-4" color="primary" @click="resetApplicationStatus">다시 신청하기</v-btn>
          </div>
          <div v-else>
            <h1 class="text-h4 font-weight-bold text-center mb-8">작가 등록 신청</h1>
            <v-form @submit.prevent="handleApplicationSubmit">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :model-value="user.name" label="이름" readonly variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :model-value="user.email" label="이메일" readonly variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-textarea
                v-model="form.introduction"
                label="작가 소개*"
                variant="outlined"
                counter
                maxlength="500"
                :rules="[v => !!v || '작가 소개는 필수입니다.', v => (v && v.length >= 10) || '최소 10자 이상 작성해주세요.']"
              ></v-textarea>
              <v-checkbox
                v-model="form.agreement"
                label="개인 정보 수집 및 이용에 동의합니다."
                :rules="[v => !!v || '동의가 필요합니다.']"
              ></v-checkbox>
              <v-btn type="submit" :loading="isLoading" :disabled="!isFormValid" color="primary" block size="x-large">
                신청하기
              </v-btn>
            </v-form>
          </div>
        </v-card-text>
      </v-card>
      <div v-else class="text-center pa-16">
        <p>사용자 정보를 불러오는 중입니다...</p>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </v-container>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">{{ snackbar.text }}</v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { useUserStore } from '@/store/userStore'; // 수정된 경로
import { useWriterStore } from '@/store/writerStore'; // 수정된 경로

export default {
  name: 'AuthorApplicationPage',
  data: () => ({
    form: { introduction: '', agreement: false },
    snackbar: { show: false, text: '', color: 'success' },
  }),
  computed: {
    // mapState 헬퍼를 사용하여 스토어 상태를 컴포넌트의 computed 속성으로 매핑합니다.
    ...mapState(useUserStore, ['isLoggedIn', 'currentUser']),
    // currentUser를 user로 별칭 지정 (템플릿에서 user.name 등으로 접근하기 위함)
    user() {
      return this.currentUser;
    },
    ...mapState(useWriterStore, ['applicationStatus', 'isLoading']),
    isFormValid() {
      return this.form.introduction && this.form.introduction.length >= 10 && this.form.agreement;
    },
  },
  methods: {
    async handleApplicationSubmit() {
      if (!this.isFormValid) {
        this.showSnackbar('필수 정보를 모두 입력하고 동의해주세요.', 'warning');
        return;
      }
      const writerStore = useWriterStore();
      try {
        await writerStore.submitApplication({ userId: this.user.id, bio: this.form.introduction });
        this.showSnackbar('작가 신청이 완료되었습니다. 관리자 승인을 기다려주세요.', 'success');
        // 폼 초기화
        this.form.introduction = '';
        this.form.agreement = false;
      } catch (e) {
        this.showSnackbar('작가 신청 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        console.error("Submission error:", e);
      }
    },
    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    // 테스트 및 개발을 위한 상태 초기화 메소드
    resetApplicationStatus() {
      const writerStore = useWriterStore();
      writerStore.setApplicationStatus('NONE');
      this.showSnackbar('작가 신청 상태가 초기화되었습니다.', 'info');
    }
  },
  async created() {
    const userStore = useUserStore();
    // 페이지 로드 시 사용자 정보를 먼저 로드합니다.
    await userStore.loadCurrentUser();

    if (this.isLoggedIn && this.user) {
      const writerStore = useWriterStore();
      await writerStore.checkMyApplicationStatus(this.user.id);
    } else if (!this.isLoggedIn) {
      // 로그인되지 않은 경우 스낵바를 통해 안내
      this.showSnackbar('작가 신청은 로그인 후 이용 가능합니다.', 'info');
    }
  },
  // 스토어 상태 변경을 관찰하여 필요한 경우 동작
  watch: {
    isLoggedIn(newVal) {
      if (newVal && this.user) {
        const writerStore = useWriterStore();
        writerStore.checkMyApplicationStatus(this.user.id);
      }
    },
    user(newVal) {
      if (newVal && this.isLoggedIn) {
        const writerStore = useWriterStore();
        writerStore.checkMyApplicationStatus(this.user.id);
      }
    }
  }
};
</script>

<style scoped>
.application-background {
  background: linear-gradient(to right, #ece9e6, #ffffff);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.application-container {
  max-width: 800px;
}

.application-panel {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>