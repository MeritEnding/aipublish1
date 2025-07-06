<template>
  <v-app class="app-background">
    <v-app-bar app color="white" class="app-bar-style" flat height="70">
      <v-container fluid class="d-flex align-center">
        <v-text-field
          placeholder="검색어를 입력해주세요."
          prepend-inner-icon="mdi-magnify"
          dense
          outlined
          rounded
          hide-details
        ></v-text-field>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container fluid class="main-container pa-0">
        <v-carousel
          cycle
          height="400"
          hide-delimiter-background
          show-arrows-on-hover
          class="elevation-4 mb-12"
        >
          <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.src" cover>
            <div class="d-flex fill-height justify-center align-center carousel-title">
              <h2 class="text-h4 font-weight-bold">{{ slide.title }}</h2>
            </div>
          </v-carousel-item>
        </v-carousel>
        
        <div class="px-6">
          <v-row>
            <v-col v-for="book in books" :key="book.id" cols="12" sm="6" md="4" lg="3">
              <v-card flat color="transparent" class="book-card-item text-left" href="#">
                <v-img :src="book.image" :lazy-src="`https://picsum.photos/10/15?random=${book.id}`" :aspect-ratio="2 / 3"
                  cover class="rounded-lg book-cover-image elevation-4">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="grey-lighten-2"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
                <div class="pt-4">
                  <div class="text-h6 font-weight-bold text--primary">{{ book.title }}</div>
                  <div class="text-body-1 text--secondary mt-1">{{ book.subtitle }}</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

      </v-container>
    </v-main>

    <v-footer color="grey-darken-3" class="white--text pa-8">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="4">
            <h3 class="text-h6 font-weight-bold mb-3">AI PUBLISH</h3>
            <p class="text-body-2" style="color: #ccc;">AI와 함께 만드는 당신의 첫 번째 책. 누구나 작가가 될 수 있는 세상을 꿈꿉니다.</p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Quick Links</h4>
            <div><a href="#" class="footer-link">이용약관</a></div>
            <div><a href="#" class="footer-link">개인정보처리방침</a></div>
            <div><a href="#" class="footer-link">고객센터</a></div>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Follow Us</h4>
            <v-btn icon class="mx-1" href="#"><v-icon>mdi-github</v-icon></v-btn>
            <v-btn icon class="mx-1" href="#"><v-icon>mdi-youtube</v-icon></v-btn>
            <v-btn icon class="mx-1" href="#"><v-icon>mdi-instagram</v-icon></v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-6"></v-divider>
        <div class="text-center text-caption" style="color: #aaa;">
          &copy; {{ new Date().getFullYear() }} KT AIVLE School. All Rights Reserved.
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'FinalMainPageWithoutNav',
  data: () => ({
    slides: [
      {
        src: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2070&auto=format&fit=crop',
        title: 'AI와 함께, 당신의 이야기를 책으로'
      },
      {
        src: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2071&auto=format&fit=crop',
        title: '누구나 작가가 되는 세상'
      },
      {
        src: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'AIVLE-Book 베스트셀러'
      },
    ],
    books: [
      { id: 1, title: "안녕이라 그랬어", subtitle: "지금 우리에게 필요한 김애란식의 인사", image: "https://image.yes24.com/goods/124311848/L" },
      { id: 2, title: "마침내 특이점이 시작되다", subtitle: "인공지능을 예언한 미래학자", image: "https://image.yes24.com/goods/125345790/L" },
      { id: 3, title: "밤새들의 도시", subtitle: "2024 톨스토이문학상 수상작 김주혜 신작", image: "https://image.yes24.com/goods/125345474/L" },
      { id: 4, title: "인생의 컨닝 페이퍼", subtitle: "수천 건의 사건에서 찾아낸 인생 답안지", image: "https://image.yes24.com/goods/125740421/L" },
    ],
  }),
};
</script>

<style scoped>
.app-background {
  background-color: #f8f9fa;
  font-family: 'Pretendard', sans-serif;
}

/* main-container의 기본 패딩은 제거합니다. (캐러셀 때문에) */
.main-container {
  padding-top: 48px;
  padding-bottom: 48px;
}

.book-card-item {
  transition: transform 0.3s ease-in-out;
}

.book-card-item:hover .book-cover-image {
  transform: translateY(-12px);
  box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.15);
}

.book-cover-image {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  border-radius: 5px !important;
}

.text-h6,
.text-body-1 {
  white-space: normal;
  word-break: keep-all;
}

.app-bar-style {
  transition: box-shadow 0.3s ease-in-out;
  border-bottom: 1px solid #eee !important;
}

.carousel-title {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  color: white; /* 텍스트 색상을 흰색으로 명확하게 지정 */
}

.footer-link {
  color: #ccc;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: white;
  text-decoration: underline;
}

.nav-menu-btn {
  font-weight: 600;
  margin: 0 4px;
  transition: background-color 0.2s ease-in-out;
}

.nav-menu-btn:not(.v-btn--active):hover {
  background-color: #f5f5f5;
}

.sub-item-title {
  font-size: 0.9rem !important;
  font-weight: 500;
}
</style>