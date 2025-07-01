<template>
  <v-container class="my-page-container pa-4 pa-md-8">
    <v-card class="profile-dashboard pa-4 pa-md-6 mb-8" flat>
      <v-row align="center">
        <v-col cols="12" md="4" class="d-flex align-center flex-column flex-md-row text-center text-md-left">
          <v-avatar color="grey-lighten-2" size="100" class="mb-4 mb-md-0">
            <v-img :src="user.avatar" alt="User Avatar"></v-img>
          </v-avatar>
          <div class="ml-md-6">
            <h2 class="text-h5 font-weight-bold">{{ user.name }}</h2>
            <p class="text-body-1 text-grey-darken-1">{{ user.email }}</p>
          </div>
        </v-col>
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="primary" class="info-card pa-4 text-center">
                <v-icon size="40" class="mb-2">mdi-account-star-outline</v-icon>
                <div class="text-subtitle-1 font-weight-medium">회원 등급</div>
                <v-chip :color="user.role === '작가' ? 'indigo' : 'teal'" class="mt-2" label>{{ user.role }}</v-chip>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="amber-darken-3" class="info-card pa-4 text-center">
                <v-icon size="40" class="mb-2">mdi-star-circle-outline</v-icon>
                <div class="text-subtitle-1 font-weight-medium">보유 포인트</div>
                <div class="text-h5 font-weight-bold mt-2">{{ user.points.toLocaleString() }} P</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="green-darken-1" class="info-card pa-4 text-center">
                <v-icon size="40" class="mb-2">mdi-calendar-check-outline</v-icon>
                <div class="text-subtitle-1 font-weight-medium">구독 정보</div>
                <div class="text-body-2 mt-2">
                   만료까지 <strong class="text-h6">{{ user.subscription.remainingDays }}</strong>일 남음
                </div>
                <v-progress-linear :model-value="subscriptionPercentage" color="green-lighten-1" height="7" rounded class="mt-2"></v-progress-linear>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <h3 class="text-h6 font-weight-bold mb-4">📚 내 서재</h3>
    <v-card flat>
      <v-tabs v-model="activeTab" background-color="transparent" color="primary">
        <v-tab value="read">최근 읽은 책</v-tab>
        <v-tab value="published">내가 출간한 책</v-tab>
        <v-tab value="requests">출간 요청 내역</v-tab>
      </v-tabs>

      <v-window v-model="activeTab" class="pa-4">
        <v-window-item value="read">
          <v-row v-if="readBooks.length > 0">
            <v-col v-for="book in readBooks" :key="book.id" cols="6" sm="4" md="3" lg="2">
              <v-card class="book-card" flat color="transparent" href="#">
                <v-img :src="book.coverUrl" class="rounded-lg book-cover" aspect-ratio="2/3" cover></v-img>
                <div class="pt-2">
                  <div class="text-subtitle-2 font-weight-bold text-truncate">{{ book.title }}</div>
                  <div class="text-caption text-grey-darken-1">{{ book.author }}</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <div v-else class="text-center py-8 text-grey">최근 읽은 책이 없습니다.</div>
        </v-window-item>

        <v-window-item value="published">
          <v-row v-if="publishedBooks.length > 0">
            <v-col v-for="book in publishedBooks" :key="book.id" cols="6" sm="4" md="3" lg="2">
              <v-card class="book-card" flat color="transparent" href="#">
                <v-img :src="book.coverUrl" class="rounded-lg book-cover" aspect-ratio="2/3" cover></v-img>
                  <div class="pt-2">
                    <div class="text-subtitle-2 font-weight-bold text-truncate">{{ book.title }}</div>
                    <div class="text-caption text-grey-darken-1">{{ book.author }}</div>
                  </div>
              </v-card>
            </v-col>
          </v-row>
          <div v-else class="text-center py-8 text-grey">아직 출간한 책이 없습니다.</div>
        </v-window-item>

        <v-window-item value="requests">
          <v-list lines="two">
            <template v-if="publicationRequests.length > 0">
              <v-list-item
                v-for="request in publicationRequests"
                :key="request.id"
                class="request-item mb-2"
                border
              >
                <template v-slot:prepend>
                  <v-avatar rounded="0" class="mr-4">
                    <v-img :src="request.coverUrl"></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ request.title }}</v-list-item-title>
                <v-list-item-subtitle>요청일: {{ request.requestDate }}</v-list-item-subtitle>
                <template v-slot:append>
                  <div class="d-flex align-center">
                    <v-chip :color="getStatusColor(request.status)" class="font-weight-bold" size="small">
                      {{ request.status }}
                    </v-chip>
                  </div>
                </template>
              </v-list-item>
            </template>
            <div v-else class="text-center py-8 text-grey">출간을 요청한 내역이 없습니다.</div>
          </v-list>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "MyPage",
  data: () => ({
    activeTab: 'read',
    user: {
      name: '',
      email: '',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      role: '일반회원',
      points: 0,
      subscription: { totalDays: 30, remainingDays: 0 },
    },
    readBooks: [],
    publicationRequests: [],
  }),
  computed: {
    subscriptionPercentage() {
      if (!this.user.subscription || this.user.subscription.totalDays === 0) return 0;
      return (this.user.subscription.remainingDays / this.user.subscription.totalDays) * 100;
    },
    publishedBooks() {
      return this.publicationRequests.filter(req => req.status === '승인됨');
    },
  },
  methods: {
    getStatusColor(status) {
      if (status === '대기중') return 'orange';
      if (status === '승인됨') return 'green';
      if (status === '거부됨') return 'error';
      return 'grey';
    },
    async fetchMyPageData() {
      // ✅ 핵심: localStorage에서 로그인 시 저장한 userId를 직접 사용합니다.
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
        this.$router.push('/login');
        return;
      }

      try {
        // ✅ 이름과 이메일만 가져오도록 API를 분리하지 않고, /users/{id}/views 하나로 처리합니다.
        const userResponse = await axios.get(`/users/${userId}/views`);
        this.user.name = userResponse.data.name;
        this.user.email = userResponse.data.email;
        
        // 나머지 정보는 아직 API가 없으므로 임시 데이터를 유지합니다.
        this.user.points = 12500; // 임시 데이터
        this.user.role = '작가'; // 임시 데이터
        this.user.subscription.remainingDays = 25; // 임시 데이터

        this.readBooks = [
            { id: 1, title: "마침내 특이점이 시작되다", author: "레이 커즈와일", coverUrl: "https://image.yes24.com/goods/125345790/L" },
        ];
        this.publicationRequests = [
            { id: 201, title: "도시의 별빛", author: "이정훈", requestDate: "2025-06-28", status: '대기중', coverUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4c85?q=80&w=2069&auto=format&fit=crop"},
            { id: 101, title: "나의 첫 AI 소설", author: "이정훈", requestDate: "2025-06-15", status: '승인됨', coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop"},
        ];

      } catch (error) {
        console.error("마이페이지 데이터 로딩 중 오류 발생:", error);
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
      }
    }
  },
  mounted() {
    this.fetchMyPageData();
  },
};
</script>

<style scoped>
.my-page-container {
  background-color: #f7f8fc;
  min-height: 100vh;
}
.profile-dashboard {
  border: 1px solid #e0e0e0 !important;
  background-color: white;
}
.info-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.07);
}
.book-card {
  transition: transform 0.2s ease-in-out;
}
.book-card:hover {
  transform: translateY(-8px);
}
.book-cover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease-in-out;
}
.book-card:hover .book-cover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.request-item {
  transition: background-color 0.2s ease-in-out;
}
.request-item:hover {
  background-color: #f5f5f5;
}
</style>