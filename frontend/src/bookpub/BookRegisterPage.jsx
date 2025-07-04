import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../axios';
import './BookRegisterPage.css';
import Header from '../mainPage/Header';
import Footer from '../mainPage/Footer';
import { useAuth } from '../contexts/AuthContext';

const BookRegisterPage = () => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();
    const { bookId: paramBookId } = useParams();

    const [bookForm, setBookForm] = useState({
        bookId: null,
        title: '',
        content: '',
        summary: '',
        coverImageUrl: '',
        category: '',
        price: 0,
        status: 'DRAFT',
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [isApprovedWriter, setIsApprovedWriter] = useState(false);

    useEffect(() => {
        const checkPermissionsAndLoadData = async () => {
            if (!isLoggedIn || !user?.id) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
                return;
            }

            try {
                // 1. 작가 권한이 있는지 먼저 확인
                const writerStatusResponse = await api.get(`/writers/${user.id}/isApproved`);
                if (writerStatusResponse.data === true) {
                    setIsApprovedWriter(true);
                } else {
                    setIsLoading(false);
                    return;
                }

                // 2. 작가인 경우, 편집할 도서 정보가 있는지 확인
                if (paramBookId) {
                    const response = await api.get(`/books/${paramBookId}?userId=${user.id}`);
                    const bookData = response.data;
                    if (bookData.userId !== user.id) {
                        alert('이 도서를 편집할 권한이 없습니다.');
                        navigate('/mypage');
                        return;
                    }
                    setBookForm(bookData);
                    if (bookData.status === 'PUBLISHED' || bookData.status === 'SUBMITTED') {
                        setCurrentStep(2);
                    }
                }
            } catch (err) {
                console.error('권한 확인 또는 도서 정보 로딩 실패:', err);
                setError('페이지를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        checkPermissionsAndLoadData();
    }, [isLoggedIn, user, navigate, paramBookId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSaveAndGenerate = async (e) => {
        e.preventDefault();
        setError('');
        if (!bookForm.title || !bookForm.content) {
            setError('제목과 내용은 필수 입력 항목입니다.');
            return;
        }
        setSubmitLoading(true);
        try {
            const response = await api.post('/books/savebookcommand', {
                userId: user.id,
                title: bookForm.title,
                content: bookForm.content,
            });
            setBookForm(response.data);
            alert('원고 저장 및 메타데이터 생성이 완료되었습니다! 최종 내용을 검토해주세요.');
            setCurrentStep(2);
        } catch (err) {
            console.error('원고 저장 및 생성 실패:', err);
            setError('원고 처리 중 오류가 발생했습니다.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleSubmitBook = async () => {
        if (!window.confirm('정말로 이 도서를 출간 요청하시겠습니까?')) return;

        setSubmitLoading(true);
        setError('');
        try {
            const response = await api.post('/books/submitbookcommand', { 
                bookId: bookForm.bookId,
                userId: user.id
            });
            setBookForm(prevForm => ({ ...prevForm, status: response.data.status }));
            alert('도서 출간 요청이 성공적으로 제출되었습니다!');
            navigate('/book/explore');
        } catch (err) {
            console.error('도서 출간 요청 실패:', err);
            const errorMessage = err.response?.data || '도서 출간 요청 중 오류가 발생했습니다.';
            setError(errorMessage);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="book-register-page-wrapper loading">
                <Header />
                <main className="book-register-main-content">
                    <div className="loading-spinner"></div>
                    <p>사용자 권한 및 도서 정보를 확인하는 중...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!isApprovedWriter) {
        return (
            <div className="book-register-page-wrapper">
                <Header />
                <main className="book-register-main-content">
                    <div className="permission-denied-box">
                        <span className="permission-icon">🖋️</span>
                        <h2>작가 권한이 필요합니다</h2>
                        <p>도서를 등록하고 출간하려면 작가 등록 신청 및 승인이 필요합니다.</p>
                        <button onClick={() => navigate('/author/application')} className="submit-button">
                            작가 신청하러 가기
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="book-register-page-wrapper">
            <Header />
            <main className="book-register-main-content">
                <div className="book-register-container">
                    <h1 className="auth-title">도서 {paramBookId ? '편집' : '등록'} 및 출간 요청</h1>
                    {error && <p className="error-message mb-4">{error}</p>}

                    <div className="step-navigation">
                        <button className={`step-button ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>1</button>
                        <button className={`step-button ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)} disabled={bookForm.status !== 'PUBLISHED'}>2</button>
                    </div>

                    <div className="step-description">
                        {currentStep === 1 && <p>1단계: 원고 작성 및 AI 메타데이터 생성</p>}
                        {currentStep === 2 && <p>2단계: 최종 검토 및 출간 요청</p>}
                    </div>

                    <div className="form-section">
                        {currentStep === 1 && (
                            <form onSubmit={handleSaveAndGenerate}>
                                <div className="form-group">
                                    <label htmlFor="title">도서 제목*</label>
                                    <input id="title" name="title" type="text" value={bookForm.title} onChange={handleInputChange} placeholder="도서 제목을 입력하세요" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="content">도서 내용*</label>
                                    <textarea id="content" name="content" value={bookForm.content} onChange={handleInputChange} placeholder="도서의 본문을 입력하세요" rows="20" required></textarea>
                                </div>
                                <button type="submit" className="submit-button" disabled={submitLoading}>
                                    {submitLoading ? 'AI 분석 및 저장 중...' : '원고 저장 및 메타데이터 생성'}
                                </button>
                            </form>
                        )}

                        {currentStep === 2 && (
                            <div className="publish-review-section">
                                <div className="review-item"><strong>제목:</strong> <span>{bookForm.title}</span></div>
                                <div className="review-item"><strong>요약:</strong> <span>{bookForm.summary}</span></div>
                                <div className="review-item"><strong>카테고리:</strong> <span>{bookForm.category}</span></div>
                                <div className="review-item"><strong>가격:</strong> <span>{bookForm.price} 포인트</span></div>
                                <div className="review-item"><strong>표지:</strong> <img src={bookForm.coverImageUrl} alt="Cover" className="review-cover" /></div>
                                <p className="status-info">현재 상태: {bookForm.status}</p>
                                <button className="submit-button" onClick={handleSubmitBook} disabled={submitLoading || bookForm.status !== 'PUBLISHED'}>
                                    {submitLoading ? '출간 요청 중...' : '최종 출간 요청'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookRegisterPage;