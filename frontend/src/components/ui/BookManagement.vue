<template>
  <v-container fluid>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" top>
      {{ snackbar.text }}
    </v-snackbar>

    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon>mdi-book-open-page-variant</v-icon>
        <span class="ms-2">도서 관리 시스템</span>
      </v-card-title>
      
      <v-card-text class="d-flex flex-wrap align-center" style="gap: 10px;">
        <v-btn small color="primary" @click="fetchBooks" :loading="loading">
          <v-icon left small>mdi-book-multiple</v-icon> 전체 도서 조회
        </v-btn>
        <v-btn small color="amber" dark @click="fetchBestsellers" :loading="loading">
          <v-icon left small>mdi-star</v-icon> 베스트셀러 조회
        </v-btn>
        
        <v-spacer></v-spacer>

        <v-text-field
          v-model="userId"
          label="사용자 ID"
          dense
          hide-details
          solo
          class="me-4"
          style="max-width: 150px;"
          placeholder="ex: 1"
        ></v-text-field>
        <v-btn small color="green" dark @click="fetchPurchasedBooks" :disabled="!userId" :loading="loading">
          <v-icon left small>mdi-cart</v-icon> 구매 목록 조회
        </v-btn>
        <v-btn small color="success" class="ms-4" @click="openEditDialog()">
          <v-icon left small>mdi-plus</v-icon> 신규 도서 등록
        </v-btn>
      </v-card-text>

      <v-container fluid>
        <div v-if="loading" class="text-center pa-16">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4">도서 목록을 불러오는 중...</p>
        </div>

        <v-row v-else-if="books.length > 0">
          <v-col
            v-for="book in books"
            :key="book.bookId"
            cols="12" sm="6" md="4" lg="3"
          >
            <v-card class="book-card" flat outlined>
              <v-img
                :src="book.coverImageUrl || 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg'"
                height="300px"
                cover
                class="align-end"
              >
                <v-card-title class="text-white text-shadow">{{ book.title }}</v-card-title>
              </v-img>

              <v-card-subtitle class="pt-4">
                상태: <v-chip x-small :color="getStatusColor(book.status)">{{ book.status }}</v-chip>
              </v-card-subtitle>

              <v-card-text>
                <div>ID: {{ book.bookId }}</div>
                <div>가격: {{ book.price ? `${book.price.toLocaleString()}원` : '미정' }}</div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon small title="수정/작업" @click="openEditDialog(book)"><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn icon small title="상세보기" @click="getBookDetails(book.bookId)"><v-icon>mdi-eye</v-icon></v-btn>
                <v-btn icon small title="삭제" @click="deleteBook(book.bookId)"><v-icon color="red">mdi-delete</v-icon></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div v-else class="text-center pa-16 text-grey">
          <p>표시할 도서가 없습니다.</p>
        </div>
      </v-container>
    </v-card>

    <v-dialog v-model="editDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedItem.bookId ? '도서 작업' : '신규 도서 등록' }}</span>
        </v-card-title>
        <v-card-text>
          <p class="font-weight-bold">기본 정보</p>
          <v-text-field v-model="editedItem.title" label="제목*"></v-text-field>
          <v-textarea v-model="editedItem.content" label="내용*"></v-textarea>
          
          <v-divider class="my-4"></v-divider>
          <p class="font-weight-bold">메타데이터 (출간 시 필요)</p>
          <v-text-field v-model="editedItem.summary" label="요약"></v-text-field>
          <v-text-field v-model="editedItem.coverImageUrl" label="커버 이미지 URL"></v-text-field>
          <v-text-field v-model="editedItem.category" label="카테고리"></v-text-field>
          <v-text-field v-model="editedItem.price" label="가격" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeEditDialog">취소</v-btn>
          <v-btn color="indigo" dark @click="handleCommand('savebookcommand')">임시 저장</v-btn>
          <v-btn v-if="editedItem.bookId" color="teal" dark @click="handleCommand('updatemetadata')">메타데이터 업데이트</v-btn>
          <v-btn v-if="editedItem.bookId" color="purple" dark @click="handleCommand('submitbookcommand')">출간 요청</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailsDialog" max-width="600px">
      <v-card>
        <v-card-title>도서 상세 정보</v-card-title>
        <v-card-text v-if="detailedItem">
          <p><strong>ID:</strong> {{ detailedItem.bookId }}</p>
          <p><strong>제목:</strong> {{ detailedItem.title }}</p>
          <p><strong>내용:</strong> {{ detailedItem.content }}</p>
          <p><strong>카테고리:</strong> {{ detailedItem.category }}</p>
          <p><strong>가격:</strong> {{ detailedItem.price ? `${detailedItem.price.toLocaleString()}원` : '-' }}</p>
          <p><strong>상태:</strong> {{ detailedItem.status }}</p>
          <p><strong>조회수:</strong> {{ detailedItem.viewCount }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="detailsDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@axios';

export default {
  name: 'BookManagement',
  data: () => ({
    loading: false,
    books: [],
    userId: '1', // 테스트용 사용자 ID
    snackbar: { show: false, text: '', color: 'success' },
    editDialog: false,
    detailsDialog: false,
    editedItem: {},
    detailedItem: null,
  }),
  created() {
    this.fetchBooks();
  },
  methods: {
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text; this.snackbar.color = color; this.snackbar.show = true;
    },
    handleError(error, context = '작업') {
      const message = error.response?.data?.message || `${context} 중 오류가 발생했습니다.`;
      this.showSnackbar(message, 'error');
      console.error(`${context} 실패:`, error);
    },
    getStatusColor(status) {
      if (status === 'DRAFT') return 'grey';
      if (status === 'PUBLISHED') return 'primary';
      if (status === 'SUBMITTED') return 'orange';
      return 'black';
    },

    // --- 데이터 조회 ---
    async fetchBooks() {
      this.loading = true; this.books = [];
      try {
        const response = await axios.get('/books');
        const booksData = response.data?._embedded?.books || response.data;
        if (Array.isArray(booksData)) this.books = booksData;
        this.showSnackbar(`도서 ${this.books.length}권을 조회했습니다.`);
      } catch (e) { this.handleError(e, '전체 도서 조회'); } 
      finally { this.loading = false; }
    },
    async fetchBestsellers() {
      this.loading = true; this.books = [];
      try {
        const response = await axios.get('/books/bestsellers');
        const booksData = response.data?._embedded?.books || response.data;
        if (Array.isArray(booksData)) this.books = booksData;
        this.showSnackbar(`베스트셀러 ${this.books.length}권을 조회했습니다.`);
      } catch (e) { this.handleError(e, '베스트셀러 조회'); } 
      finally { this.loading = false; }
    },
    async fetchPurchasedBooks() {
      this.loading = true; this.books = [];
      try {
        const response = await axios.get('/books/purchased', { params: { userId: this.userId } });
        const booksData = response.data?._embedded?.books || response.data;
        if (Array.isArray(booksData)) this.books = booksData;
        this.showSnackbar('구매한 도서 목록을 조회했습니다.');
      } catch (e) { this.handleError(e, '구매 목록 조회'); } 
      finally { this.loading = false; }
    },
    async getBookDetails(bookId) {
      if (!this.userId) return this.showSnackbar('사용자 ID를 입력하세요.', 'warning');
      try {
        const response = await axios.get(`/books/${bookId}`, { params: { userId: this.userId } });
        this.detailedItem = response.data;
        this.detailsDialog = true;
      } catch (e) { this.handleError(e, '도서 상세 조회'); }
    },

    // --- 데이터 삭제 ---
    async deleteBook(bookId) {
      if (!this.userId) return this.showSnackbar('관리자 ID를 입력하세요.', 'warning');
      if (confirm(`(관리자 권한 필요) 도서(ID: ${bookId})를 정말로 삭제하시겠습니까?`)) {
        try {
          await axios.delete(`/books/${bookId}`, { params: { userId: this.userId } });
          this.showSnackbar('도서를 성공적으로 삭제했습니다.');
          this.fetchBooks();
        } catch (e) { this.handleError(e, '도서 삭제'); }
      }
    },
    
    // --- 데이터 생성/수정 ---
    openEditDialog(item = null) {
      this.editedItem = item ? { ...item } : { title: '', content: '' };
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    async handleCommand(commandType) {
      const payload = { ...this.editedItem, userId: this.userId };
      try {
        await axios.post(`/books/${commandType}`, payload);
        this.showSnackbar(`${commandType} 작업이 성공적으로 완료되었습니다.`);
        this.closeEditDialog();
        this.fetchBooks();
      } catch (e) { this.handleError(e, `${commandType} 작업`); }
    },
  },
};
</script>

<style scoped>
.v-card-title {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}
.book-card {
  transition: all 0.2s ease-in-out;
}
.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}
.text-shadow {
  text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
}
</style>