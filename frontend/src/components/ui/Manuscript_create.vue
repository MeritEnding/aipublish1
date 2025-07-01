<template>
  <div class="writing-background">
    <v-container class="writing-container">
      <v-card class="writing-panel" flat>
        <v-card-text class="pa-md-12 pa-8">
          <v-text-field
            v-model="manuscript.title"
            placeholder="제목"
            variant="underlined"
            class="title-input mb-8"
            hide-details
          ></v-text-field>

          <v-textarea
            v-model="manuscript.content"
            placeholder="출판 하고 싶은 글을 작성해주세요!"
            variant="plain"
            auto-grow
            no-resize
            rows="20"
            class="content-editor"
            hide-details
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="pa-4 action-bar">
          <v-spacer></v-spacer>
          <v-btn
            size="large"
            variant="text"
            class="action-btn"
            @click="saveDraft"
          >
            글 저장
          </v-btn>
          <v-btn
            size="large"
            variant="flat"
            color="primary"
            class="action-btn ml-2"
            @click="startAiPublishingDialog = true"
          >
            출간요청
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'WritePage',
  data: () => ({
    manuscript: {
      title: '',
      content: '',
    },
    snackbar: {
      show: false,
      text: '',
      color: 'success',
    }
  }),
  methods: {
    saveDraft() {
      // 1. 여기에 실제 '초안 저장' API를 호출하는 로직을 구현합니다.
      // 예: await axios.post('/api/manuscripts/draft', this.manuscript);
      console.log('Saving draft:', this.manuscript);

      // 2. 성공 시 사용자에게 피드백을 줍니다.
      this.showSnackbar('글이 임시 저장되었습니다.');
    },
    async requestPublication() {
      if (!this.manuscript.title || !this.manuscript.content) {
        this.showSnackbar('제목과 내용을 모두 입력해주세요.', 'error');
        return;
      }
      
      // 1. 여기에 실제 '출간 요청' API를 호출하는 로직을 구현합니다.
      // 예: await axios.post('/api/publications/request', this.manuscript);
      console.log('Requesting publication:', this.manuscript);

      // 2. 성공 피드백을 사용자에게 보여줍니다.
      this.showSnackbar('출간 요청이 완료되었습니다. 관리자 검토 후 결과가 통보됩니다.');
      
      // 3. [변경] /aiBookProcessors 경로로 페이지를 이동시킵니다.
      this.$router.push('/aiBookProcessors'); 
    },
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
}
</script>

<style scoped>
.writing-background {
  background-color: #f4f5f7; 
  min-height: 100vh;
  padding-top: 48px;
}

.writing-container {
  max-width: 900px; 
}

.writing-panel {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}


.title-input >>> .v-input__control .v-field__input {
  font-size: 2.5rem !important; 
  font-weight: 700;
  padding-bottom: 8px;
}


.content-editor >>> .v-field__input {
  font-size: 1.125rem !important; 
  line-height: 1.8 !important; 
  color: #333;
  font-family: 'Noto Serif KR', serif; 
}


.action-bar {
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

.action-btn {
  font-weight: 600;
}
</style>