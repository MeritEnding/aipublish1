<template>
  <v-container>
    <div v-if="!isAdmin" class="text-center pa-16"><v-alert type="error">접근 권한이 없습니다.</v-alert></div>
    <v-card v-else>
      <v-card-title class="d-flex align-center">작가 신청 관리 <v-spacer></v-spacer> <v-btn @click="handleFetch" :loading="isLoading">새로고침</v-btn></v-card-title>
      <v-data-table :headers="headers" :items="candidates" :loading="isLoading">
        <template v-slot:item.actions="{ item }">
          <div v-if="item.status === 'PENDING'">
            <v-btn small color="success" @click="handleUpdateStatus(item.userId, 'APPROVED')">승인</v-btn>
            <v-btn small color="error" class="ml-2" @click="handleUpdateStatus(item.userId, 'REJECTED')">반려</v-btn>
          </div>
          <v-chip v-else :color="item.status === 'APPROVED' ? 'green' : 'red'">{{ item.status }}</v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">{{ snackbar.text }}</v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useUserStore } from '@/store/users';
import { useWriterStore } from '@/store/writerStore';

export default {
  name: 'WriterManagementPage',
  data: () => ({
    snackbar: { show: false, text: '', color: 'success' },
    headers: [ { title: 'ID', value: 'userId' }, { title: '이름', value: 'name' }, { title: '소개', value: 'bio' }, { title: '상태', value: 'status' }, { title: '작업', value: 'actions' } ],
  }),
  computed: {
    ...mapState(useUserStore, { user: 'currentUser', isAdmin: 'isAdmin' }),
    ...mapState(useWriterStore, { candidates: 'writerCandidates', isLoading: 'isLoading' }),
  },
  methods: {
    ...mapActions(useWriterStore, {
      fetchCandidates: 'fetchCandidates',
      updateStatus: 'updateStatus'
    }),
    async handleFetch() {
      try {
        await this.fetchCandidates(this.user.id);
      } catch (e) { this.showSnackbar('목록 조회 실패', 'error'); }
    },
    async handleUpdateStatus(candidateId, newStatus) {
      try {
        await this.updateStatus({ adminId: this.user.id, candidateId, newStatus });
        this.showSnackbar('상태 변경 완료', 'success');
      } catch (e) { this.showSnackbar('상태 변경 실패', 'error'); }
    },
    showSnackbar(text, color) { this.snackbar.text = text; this.snackbar.color = color; this.snackbar.show = true; },
  },
  created() {
    if (this.isAdmin) {
      this.handleFetch();
    } else if (!this.user) {
      this.$router.push('/login');
    }
  },
};
</script>