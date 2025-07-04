import React, { useState, useEffect, useMemo } from 'react';
import api from '../axios';
import './BookExplorePage.css';
import Header from '../mainPage/Header';
import Footer from '../mainPage/Footer';
import BookCard from '../mainPage/BookCard';
import { useAuth } from '../contexts/AuthContext';

const BookExplorePage = () => {
    const { isLoggedIn, user } = useAuth();
    const [books, setBooks] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);
    const [purchasedBooks, setPurchasedBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState({ all: null, bestsellers: null, purchased: null });
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            setError({ all: null, bestsellers: null, purchased: null });

            const promises = [
                api.get('/books?status=PUBLISHED'),
                api.get('/books/bestsellers')
            ];

            if (isLoggedIn && user?.id) {
                promises.push(api.get(`/books/purchased?userId=${user.id}`));
            }

            const results = await Promise.allSettled(promises);

            // 전체 도서 결과 처리
            if (results[0].status === 'fulfilled') {
                setBooks(results[0].value.data);
            } else {
                console.error('전체 도서 목록 로딩 실패:', results[0].reason);
                setError(prev => ({ ...prev, all: '전체 도서 목록을 불러올 수 없습니다.' }));
            }

            // 베스트셀러 결과 처리
            if (results[1].status === 'fulfilled') {
                setBestsellers(results[1].value.data);
            } else {
                console.error('베스트셀러 목록 로딩 실패:', results[1].reason);
                setError(prev => ({ ...prev, bestsellers: '베스트셀러 목록을 불러올 수 없습니다.' }));
            }
            
            // 구매한 도서 결과 처리 (로그인 시에만)
            if (isLoggedIn && user?.id) {
                if (results[2] && results[2].status === 'fulfilled') {
                    setPurchasedBooks(results[2].value.data);
                } else {
                    console.error('구매한 도서 목록 로딩 실패:', results[2]?.reason);
                    setError(prev => ({ ...prev, purchased: '구매한 도서 목록을 불러오는 중 오류가 발생했습니다.' }));
                }
            } else {
                setPurchasedBooks([]);
            }

            setIsLoading(false);
        };

        fetchBooks();
    }, [isLoggedIn, user]);

    // [추가] 구매한 도서 ID 목록을 Set으로 만들어 빠른 조회를 위함
    // useMemo를 사용하여 purchasedBooks가 변경될 때만 새로 계산
    const purchasedBookIds = useMemo(() => 
        new Set(purchasedBooks.map(b => b.bookId)),
    [purchasedBooks]);


    if (isLoading) {
        return (
            <div className="book-explore-page-wrapper loading">
                <Header />
                <main className="book-explore-main-content">
                    <div className="loading-spinner"></div>
                    <p>도서 목록을 불러오는 중...</p>
                </main>
                <Footer />
            </div>
        );
    }

    const renderBookGrid = (bookList, errorMessage) => {
        if (errorMessage) {
            return <p className="no-books-message error">{errorMessage}</p>;
        }
        if (!bookList || bookList.length === 0) {
            return <p className="no-books-message">아직 등록된 도서가 없습니다.</p>;
        }
        return (
            <div className="book-grid">
                {bookList.map((book) => (
                    // [변경] isPurchased prop을 BookCard로 전달
                    <BookCard
                        key={book.bookId}
                        book={book}
                        isPurchased={purchasedBookIds.has(book.bookId)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="book-explore-page-wrapper">
            <Header />
            <main className="book-explore-main-content">
                <div className="book-explore-container">
                    <h1 className="explore-title">도서 둘러보기</h1>

                    <div className="tab-navigation">
                        <button
                            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            전체 도서 ({books.length})
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'bestsellers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bestsellers')}
                        >
                            베스트셀러 ({bestsellers.length})
                        </button>
                        {isLoggedIn && (
                            <button
                                className={`tab-button ${activeTab === 'purchased' ? 'active' : ''}`}
                                onClick={() => setActiveTab('purchased')}
                            >
                                구매한 도서 ({purchasedBooks.length})
                            </button>
                        )}
                    </div>

                    <div className="tab-content">
                        {activeTab === 'all' && (
                            <section className="books-section">
                                <h2 className="section-subtitle">모든 출간 도서</h2>
                                {renderBookGrid(books, error.all)}
                            </section>
                        )}
                        {activeTab === 'bestsellers' && (
                            <section className="books-section">
                                <h2 className="section-subtitle">인기 베스트셀러</h2>
                                {renderBookGrid(bestsellers, error.bestsellers)}
                            </section>
                        )}
                        {activeTab === 'purchased' && isLoggedIn && (
                            <section className="books-section">
                                <h2 className="section-subtitle">내가 구매한 도서</h2>
                                {renderBookGrid(purchasedBooks, error.purchased)}
                            </section>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookExplorePage;