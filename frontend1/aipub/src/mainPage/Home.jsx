// src/pages/Home.js
import React, { useEffect, useState } from "react"; // useEffect, useState 추가
import Header from "../mainPage/Header"; // 경로 수정
import HeroSection from "../mainPage/HeroSection"; // 경로 수정
import BookCard from "../mainPage/BookCard"; // 경로 수정
import Footer from "../mainPage/Footer"; // 경로 수정
import './Home.css'; // Home 페이지 전용 스타일
import axios from 'axios'; // API 호출을 위해 axios 임포트

const Home = () => {
  // 현재는 하드코딩된 더미 데이터. 실제 추천 로직이 있다면 API 호출로 변경
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 홈 페이지에서 표시할 더미 도서 목록 (이것이 "추천 도서"가 됩니다)
  const initialBooksData = [
    { id: 1, title: "안녕이라 그랬어", subtitle: "지금 우리에게 필요한 김애란식의 인사", coverImageUrl: "https://image.yes24.com/goods/124311848/L" },
    { id: 2, title: "마침내 특이점이 시작되다", subtitle: "인공지능을 예언한 미래학자", coverImageUrl: "https://image.yes24.com/goods/125345790/L" },
    { id: 3, title: "밤새들의 도시", subtitle: "2024 톨스토이문학상 수상작 김주혜 신작", coverImageUrl: "https://image.yes24.com/goods/125345474/L" },
    { id: 4, title: "인생의 컨닝 페이퍼", subtitle: "수천 건의 사건에서 찾아낸 인생 답안지", coverImageUrl: "https://image.yes24.com/goods/125740421/L" },
    { id: 5, title: "파친코", subtitle: "이민진 작가의 감동적인 가족 서사", coverImageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/450x0/IMAGE/BOOK/IMAGE2/KOR/424/KOR9791190412424.jpg" },
    { id: 6, title: "아몬드", subtitle: "손원평 작가의 베스트셀러 소설", coverImageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/450x0/IMAGE/BOOK/IMAGE2/KOR/080/KOR9791160408008.jpg" },
    { id: 7, title: "불편한 편의점", subtitle: "김호연 작가의 따뜻한 힐링 소설", coverImageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/450x0/IMAGE/BOOK/IMAGE2/KOR/307/KOR9791165343075.jpg" },
    { id: 8, title: "죽은 자의 집 청소", subtitle: "김새별 작가의 특별한 직업 이야기", coverImageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/450x0/IMAGE/BOOK/IMAGE2/KOR/138/KOR9791190038138.jpg" },
  ];

  useEffect(() => {
    // 실제 '추천 도서'는 별도의 API (예: /books/recommended)에서 가져올 수 있지만,
    // 여기서는 일단 하드코딩된 데이터를 사용합니다.
    // '인기 도서'는 백엔드의 bestsellers API를 사용할 수 있습니다.
    const fetchHomeBooks = async () => {
      setIsLoading(true);
      setError('');
      try {
        setRecommendedBooks(initialBooksData.slice(0, 4)); // 상위 4개 추천 도서
        
        // 백엔드에서 실제 베스트셀러 데이터를 가져와 '인기 도서'로 표시
        const popularResponse = await axios.get('/books/bestsellers');
        setPopularBooks(popularResponse.data.slice(0, 4)); // 인기 도서도 4개만 표시

      } catch (err) {
        console.error('홈 도서 목록 불러오기 실패:', err);
        setError('홈페이지 도서 목록을 불러오는 데 실패했습니다.');
        setRecommendedBooks(initialBooksData.slice(0, 4)); // 오류 발생 시 더미 데이터로 대체
        setPopularBooks(initialBooksData.slice(4, 8)); // 오류 발생 시 더미 데이터로 대체
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeBooks();
  }, []);

  const renderBookGrid = (bookList) => {
    if (bookList.length === 0) {
      return <p className="no-books-message text-center">도서 정보가 없습니다.</p>;
    }
    return (
      <div className="book-grid">
        {bookList.map((book) => (
          // BookCard는 bookId 필드를 기대하므로, id를 bookId로 매핑
          // summary 필드도 book.subtitle 대신 book.summary로 넘겨줌 (BookCard.js에서 book.summary || book.subtitle 사용하도록 수정 가정)
          <BookCard key={book.id || book.bookId} book={{ ...book, bookId: book.id || book.bookId, summary: book.subtitle || book.summary }} />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="home-page-wrapper loading">
        <Header />
        <main className="home-main-content">
          <div className="loading-spinner"></div>
          <p>홈페이지 도서 정보를 불러오는 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page-wrapper error">
        <Header />
        <main className="home-main-content">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="back-button">다시 시도</button>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="home-page-wrapper">
      <Header />
      <main>
        <HeroSection
          title="AI와 함께, 당신의 이야기를 책으로"
          imageUrl="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2070&auto=format&fit=crop"
        />

        <section className="books-section container py-8">
          <h2 className="section-title text-center mb-6">추천 도서</h2>
          {renderBookGrid(recommendedBooks)}
        </section>

        <section className="books-section container py-8">
            <h2 className="section-title text-center mb-6">인기 도서</h2>
            {renderBookGrid(popularBooks)}
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;