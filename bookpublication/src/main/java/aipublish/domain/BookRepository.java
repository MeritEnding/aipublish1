package aipublish.domain;

import aipublish.domain.*;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(collectionResourceRel = "books", path = "books")
public interface BookRepository extends PagingAndSortingRepository<Book, Long> {
    @Query("SELECT book FROM Book book " +
        "WHERE (:bookId IS NULL OR book.bookId = :bookId) AND " +
        "(:title IS NULL OR book.title LIKE %:title%) AND " +
        "(:userId IS NULL OR book.userId = :userId) AND " +
        "(:content IS NULL OR book.content LIKE %:content%) AND " +
        "(:summary IS NULL OR book.summary LIKE %:summary%) AND " +
        "(:coverImageUrl IS NULL OR book.coverImageUrl LIKE %:coverImageUrl%) AND " +
        "(:category IS NULL OR book.category LIKE %:category%) AND " +
        "(:price IS NULL OR book.price = :price) AND " +
        "(:status IS NULL OR book.status LIKE %:status%) AND " +
        "(:viewCount IS NULL OR book.viewCount = :viewCount) AND " +
        "(:createdAt IS NULL OR book.createdAt = :createdAt)")
    Book bookDetails(
        Long bookId,
        String title,
        Long userId,
        String content,
        String summary,
        String coverImageUrl,
        String category,
        Integer price,
        String status,
        Integer viewCount,
        Date createdAt
    );
    
    List<Book> findByStatus(String status);
    // 조회수 5 이상 도서 리스트 (베스트셀러)
    @Query("SELECT b FROM Book b WHERE b.viewCount >= 5")
    List<Book> findBestsellers();

    
}
