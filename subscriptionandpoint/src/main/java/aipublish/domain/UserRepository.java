package aipublish.domain;

import aipublish.domain.*;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    // @Query(
    //     value = "select user " +
    //     "from User user " +
    //     "where(:id is null or user.id = :id) and (:name is null or user.name like %:name%) and (:email is null or user.email like %:email%) and (:pointId is null or user.pointId = :pointId) and (user.subscription = :subscription) and (:bookId is null or user.bookId = :bookId)"
    // )
    @Query(
    value = "select user " +
            "from User user " +
            "where (:id is null or user.id = :id) " +
            "and (:name is null or user.name like %:name%) " +
            "and (:email is null or user.email like %:email%) " +
            "and (user.subscription = :subscription)"
    )
    User viewMyPage(
        Long id,
        String name,
        String email,
        Boolean subscription
        // Long bookId
    );
    User findByEmail(String email);
}
