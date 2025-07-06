package aipublish.domain;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookPurchaseLogRepository extends CrudRepository<BookPurchaseLog, Long> {

    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    @Query("SELECT b.bookId FROM BookPurchaseLog b WHERE b.userId = :userId")
    List<Long> findBookIdsByUserId(@Param("userId") Long userId);
}
