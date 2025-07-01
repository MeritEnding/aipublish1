<template>
  <div class="ai-processor-background">
    <v-container>
      <v-card class="control-panel mb-6" flat>
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-robot-happy-outline</v-icon>
          <span class="font-weight-bold text-h6">AI 프로세서 제어판</span>
        </v-card-title>
        <v-card-text class="d-flex align-center flex-wrap ga-2">
          <v-btn @click="goToWritePage" color="primary" variant="flat">
            <v-icon left>mdi-plus-circle-outline</v-icon>등록
          </v-btn>
          <v-btn :disabled="!selectedRow" @click="openEditDialog()" color="grey-darken-1">
            <v-icon left>mdi-pencil-outline</v-icon>수정
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!selectedRow" @click="updateBookMetadataDialog = true" color="teal" variant="tonal">
            <v-icon left>mdi-file-document-refresh-outline</v-icon>원고 메타데이터 반영
          </v-btn>
        </v-card-text>
      </v-card>

      <v-card class="data-grid-panel" flat>
        <v-card-title>AI 출간 작업 목록</v-card-title>
        <div class="table-responsive">
          <v-table class="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>표지</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>상태</th>
                <th>생성일</th>
                <th class="text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(val, idx) in value" 
                  @click="changeSelectedRow(val)"
                  :key="val.bookId"
                  :class="{ 'selected-row': val === selectedRow }"
              >
                <td class="font-weight-medium text-grey-darken-1">#{{ idx + 1 }}</td>
                <td>
                  <v-avatar rounded="lg" size="50" class="elevation-2">
                    <v-img :src="val.coverImageUrl" :alt="val.bookId"></v-img>
                  </v-avatar>
                </td>
                <td>{{ val.category }}</td>
                <td class="font-weight-bold">{{ formatPrice(val.price) }}</td>
                <td>
                  <v-chip :color="getStatusColor(val.processStatus)" size="small" label>{{ val.processStatus }}</v-chip>
                </td>
                <td>{{ formatDate(val.createdAt) }}</td>
                <td class="text-center">
                  <v-btn icon="mdi-delete-outline" variant="text" color="grey" @click.stop="deleteRow(val)"></v-btn>
                </td>
              </tr>
              <tr v-if="!value || value.length === 0">
                <td colspan="7" class="text-center py-8 text-grey">진행중인 작업이 없습니다.</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card>
      
      <v-dialog v-model="startAiPublishingDialog" width="500">
          <StartAiPublishing @closeDialog="startAiPublishingDialog = false" @startAiPublishing="startAiPublishing" />
      </v-dialog>
      <v-dialog v-model="updateBookMetadataDialog" width="500">
          <UpdateBookMetadata @closeDialog="updateBookMetadataDialog = false" @updateBookMetadata="updateBookMetadata" />
      </v-dialog>
      <v-dialog v-model="openDialog" width="35%" transition="dialog-bottom-transition">
          </v-dialog>
      <v-dialog v-model="editDialog" width="35%" transition="dialog-bottom-transition">
          </v-dialog>
    </v-container>
  </div>
</template>

<script>
import BaseGrid from '../base-ui/BaseGrid.vue'
// 다이얼로그에서 사용하는 컴포넌트들은 실제로 import 해야 합니다.
// import StartAiPublishing from './dialogs/StartAiPublishing.vue';
// import UpdateBookMetadata from './dialogs/UpdateBookMetadata.vue';

export default {
  name: 'aiBookProcessorGrid',
  mixins:[BaseGrid],
  components: {
    // StartAiPublishing,
    // UpdateBookMetadata,
  },
  data: () => ({
    // Mixin에서 openDialog, editDialog, selectedRow, value 등의 데이터를 관리합니다.
    // 아래 value는 UI 확인을 위한 예시 데이터입니다.
    value: [
        { bookId: 'b-101', summary: 'AI 소설의 미래를 탐구하는...', coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400', category: '소설', price: 12000, processStatus: '완료', createdAt: new Date('2025-06-28') },
        { bookId: 'b-102', summary: 'Vue.js 심화 기술을 다루는...', coverImageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=400', category: 'IT/기술', price: 25000, processStatus: '진행중', createdAt: new Date('2025-06-29') },
        { bookId: 'b-103', summary: '미니멀리즘 라이프에 대한...', coverImageUrl: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=400', category: '에세이', price: 15500, processStatus: '오류', createdAt: new Date('2025-06-30') },
    ],
    // 다이얼로그 표시 여부를 관리하는 데이터
    startAiPublishingDialog: false,
    updateBookMetadataDialog: false,
  }),
  methods: {
    // Mixin에 포함된 메소드들: addNewRow, openEditDialog, changeSelectedRow, deleteRow 등

    // 페이지 이동 메소드
    goToWritePage() {
      // '/write' 경로는 프로젝트의 Vue Router 설정에 따라 달라질 수 있습니다.
      this.$router.push('/manuscript_create');
    },

    // 다이얼로그 이벤트 핸들러 (실제 구현 필요)
    startAiPublishing(params) {
      console.log('Start AI Publishing:', params);
      this.startAiPublishingDialog = false;
      // ... API 호출 로직
    },
    updateBookMetadata(params) {
      console.log('Update Book Metadata:', params);
      this.updateBookMetadataDialog = false;
      // ... API 호출 로직
    },

    // 시각적 표현을 위한 헬퍼 함수
    formatPrice(value) {
      return value ? `${value.toLocaleString()}원` : '가격 미정';
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR');
    },
    getStatusColor(status) {
      switch (status) {
        case '완료': return 'success';
        case '진행중': return 'primary';
        case '오류': return 'error';
        default: return 'grey';
      }
    }
  }
}
</script>

<style scoped>
.ai-processor-background {
  background: linear-gradient(to bottom, #f7f8fc, #ffffff);
  min-height: 100vh;
}

.control-panel {
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid #e0e0e0;
}

.data-grid-panel {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.modern-table {
  border-collapse: collapse;
  width: 100%;
}

.modern-table thead tr {
  border-bottom: 2px solid #e0e0e0;
}

.modern-table th {
  padding: 16px !important;
  text-align: left;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  color: #555;
  text-transform: uppercase;
  background-color: #f9fafb;
}

.modern-table tbody tr {
  border-bottom: 1px solid #eef2f6;
  transition: background-color 0.2s ease-in-out, border-left 0.2s ease-in-out;
}

.modern-table tbody tr:last-child {
  border-bottom: none;
}

.modern-table tbody tr:hover {
  background-color: #f5f8ff;
  cursor: pointer;
}

.modern-table td {
  padding: 12px 16px !important;
  vertical-align: middle;
}

.selected-row {
  background-color: rgba(56, 124, 255, 0.1) !important;
  border-left: 4px solid #387cff;
}
</style>