import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './BookCard.css';

const BookCard = ({ book, isPurchased }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleCardClick = () => {
        // 이미 구매한 책이면 확인창 없이 바로 이동
        if (isPurchased) {
            navigate(`/books/${book.bookId}`);
            return;
        }

        // 구매하지 않은 책일 경우에만 확인창 표시
        if (window.confirm(
            `'${book.title}' 도서를 열람하시겠습니까?\n\n상세 페이지로 이동 시 구매/열람 처리되며, ${book.price || 0} 포인트가 차감될 수 있습니다.`
        )) {
            navigate(`/books/${book.bookId}`);
        }
    };

    return (
        <div className="book-card" onClick={handleCardClick}>
            <div className="book-cover-wrapper">
                {loading && (
                    <div className="book-cover-placeholder">
                        <div className="spinner"></div>
                    </div>
                )}
                <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="book-cover-image"
                    onLoad={() => setLoading(false)}
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/200x300?text=No+Image`;
                        setLoading(false);
                    }}
                    style={{ display: loading ? 'none' : 'block' }}
                />
            </div>
            <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-subtitle">{book.summary || book.subtitle || '요약 정보가 없습니다.'}</p>
            </div>
        </div>
    );
};

export default BookCard;