<template>
  <v-container fluid class="approval-page-container pa-4 pa-md-6">
    <v-card class="pa-4" flat>
      <v-card-title class="d-flex align-center pa-2">
        <h2 class="text-h5 font-weight-bold">작가승인 및 도서 관리</h2>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="제목 또는 작가명 검색"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 300px;"
        ></v-text-field>
      </v-card-title>

      <v-tabs v-model="activeTab" color="primary" class="mt-4">
        <v-tab value="management">전체 도서 관리</v-tab>
        <v-tab value="pending">
          <v-badge color="error" :content="pendingRequests.length" inline>작가승인 요청</v-badge>
        </v-tab>
        <v-tab value="approved">승인한 내역</v-tab>
        <v-tab value="rejected">거부한 내역</v-tab>
        
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item value="pending">
          <v-data-table :headers="requestHeaders" :items="pendingRequests" :search="search" class="elevation-1 mt-4" items-per-page-text="페이지 당 항목 수">
            <template v-slot:item.status="{ item }"><v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">{{ item.status }}</v-chip></template>
            <template v-slot:item.actions="{ item }"><v-btn color="primary" variant="tonal" size="small" @click="openReviewDialog(item)">검토하기</v-btn></template>
          </v-data-table>
        </v-window-item>
        <v-window-item value="approved">
          <v-data-table :headers="requestHeaders" :items="approvedRequests" :search="search" class="elevation-1 mt-4"></v-data-table>
        </v-window-item>
        <v-window-item value="rejected">
          <v-data-table :headers="requestHeaders" :items="rejectedRequests" :search="search" class="elevation-1 mt-4"></v-data-table>
        </v-window-item>

        <v-window-item value="management">
           <v-data-table :headers="bookManagementHeaders" :items="allBooks" :search="search" class="elevation-1 mt-4" items-per-page-text="페이지 당 항목 수">
              <template v-slot:item.coverUrl="{ item }">
                <v-avatar class="ma-2" rounded="0" size="40"><v-img :src="item.coverUrl"></v-img></v-avatar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn color="error" variant="tonal" size="small" @click="openDeleteDialog(item)">삭제</v-btn>
              </template>
           </v-data-table>
        </v-window-item>
      </v-window>
    </v-card>

    <v-dialog v-model="reviewDialog" max-width="900px" transition="dialog-bottom-transition">
        </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px" transition="dialog-bottom-transition">
      <v-card v-if="selectedBookToDelete">
        <v-card-title class="d-flex align-center text-h6 font-weight-bold">
          <v-icon color="error" class="mr-2">mdi-alert-outline</v-icon>
          도서 삭제 확인
        </v-card-title>
        <v-card-text>
          <p class="py-4">
            정말로 <strong class="text-primary">'{{ selectedBookToDelete.title }}'</strong> 도서를 삭제하시겠습니까?<br>
            이 작업은 되돌릴 수 없습니다.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDeleteDialog">취소</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDeleteBook">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
export default {
  name: 'PublicationManagement',
  data: () => ({
    search: '',
    activeTab: 'pending',
    reviewDialog: false,
    deleteDialog: false, // [추가] 삭제 다이얼로그 상태
    selectedRequest: null,
    selectedBookToDelete: null, // [추가] 삭제할 도서 정보
    // 출판 요청 관리용 헤더
    requestHeaders: [
      { title: '요청일', key: 'requestDate', align: 'start' },
      { title: '책 제목', key: 'title' },
      { title: '작가명', key: 'author' },
      { title: '장르', key: 'genre' },
      { title: '상태', key: 'status' },
      { title: '관리', key: 'actions', sortable: false, align: 'center' },
    ],
    // [추가] 전체 도서 관리용 헤더
    bookManagementHeaders: [
      { title: '도서 ID', key: 'bookId', align: 'start' },
      { title: '표지', key: 'coverUrl', sortable: false },
      { title: '책 제목', key: 'title' },
      { title: '작가명', key: 'author' },
      { title: '작가 ID', key: 'authorId' },
      { title: '장르', key: 'genre' },
      { title: '출판일', key: 'publicationDate' },
      { title: '관리', key: 'actions', sortable: false, align: 'center' },
    ],
    // 출판 요청 목업 데이터
    requests: [
      { id: 1, requestDate: '2025-06-29', title: "AI 시대의 글쓰기", authorId: 'user001', author: "김작가", genre: "IT/기술", status: '대기중', coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2070&auto=format&fit=crop", synopsis: "..." },
      { id: 2, requestDate: '2025-06-28', title: "새벽의 바다", authorId: 'user002', author: "이소설", genre: "소설", status: '대기중', coverUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=1974&auto=format&fit=crop", synopsis: "..." },
      { id: 3, requestDate: '2025-06-27', title: "Vue.js 완전 정복", authorId: 'user003', author: "박개발", genre: "IT/기술", status: '승인됨', coverUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop", synopsis: "..." },
      { id: 4, requestDate: '2025-06-26', title: "잊혀진 왕국", authorId: 'user004', author: "최역사", genre: "역사", status: '거부됨', coverUrl: "https://images.unsplash.com/photo-1563291074-2bf8677a6952?q=80&w=1974&auto=format&fit=crop", synopsis: "..." },
    ],
    // [추가] 전체 도서 목록 목업 데이터 (실제로는 API로 별도 조회)
    allBooks: [
      { bookId: 'B001', coverUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop", title: "Vue.js 완전 정복", author: "박개발", authorId: 'user003', genre: "IT/기술", publicationDate: '2025-06-27' },
      { bookId: 'B002', coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop", title: "어느 개발자의 회고록", author: "김회고", authorId: 'user005', genre: "에세이", publicationDate: '2025-06-20' },
    ],
  }),
  computed: {
    pendingRequests() { return this.requests.filter(req => req.status === '대기중'); },
    approvedRequests() { return this.requests.filter(req => req.status === '승인됨'); },
    rejectedRequests() { return this.requests.filter(req => req.status === '거부됨'); },
  },
  methods: {
    openReviewDialog(item) { /* ... */ },
    closeDialog() { /* ... */ },
    approveRequest(id) { /* ... */ },
    rejectRequest(id) { /* ... */ },
    getStatusColor(status) { /* ... */ },

    // [추가] 삭제 다이얼로그 열기
    openDeleteDialog(book) {
      this.selectedBookToDelete = book;
      this.deleteDialog = true;
    },
    // [추가] 삭제 다이얼로그 닫기
    closeDeleteDialog() {
      this.deleteDialog = false;
      this.selectedBookToDelete = null;
    },
    // [추가] 삭제 확정 처리
    confirmDeleteBook() {
      if (!this.selectedBookToDelete) return;

      // 1. API에 삭제 요청 보내는 로직 (axios.delete 등)
      // 예: await axios.delete(`/api/books/${this.selectedBookToDelete.bookId}`);

      // 2. 성공 시, 로컬 데이터에서 해당 항목 제거하여 UI 즉시 업데이트
      this.allBooks = this.allBooks.filter(book => book.bookId !== this.selectedBookToDelete.bookId);

      // 3. 다이얼로그 닫기 및 스낵바 표시 등 후처리
      this.closeDeleteDialog();
      // 예: this.showSnackbar('성공적으로 삭제되었습니다.');
    },
  },
};
</script>

<style scoped>
.approval-page-container {
  background-color: #f7f8fc;
}
</style>