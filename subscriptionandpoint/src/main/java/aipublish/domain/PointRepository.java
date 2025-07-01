package aipublish.domain;

import aipublish.domain.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(collectionResourceRel = "points", path = "points")
public interface PointRepository
    extends PagingAndSortingRepository<Point, Long> {
    @Query(
        value = "select point " +
        "from Point point " +
        "where(:pointId is null or point.pointId = :pointId) and (:userId is null or point.userId = :userId)"
    )
    Point pointBalance(Long pointId, Long userId);

    //포인트조회시 사용되는 
    Optional<Point> findByUserId(Long userId);
}