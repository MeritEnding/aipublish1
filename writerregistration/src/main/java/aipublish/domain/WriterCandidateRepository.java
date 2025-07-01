package aipublish.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< DDD / Repository

@RepositoryRestResource(collectionResourceRel = "writerCandidates", path = "writer-candidates")
public interface WriterCandidateRepository extends PagingAndSortingRepository<WriterCandidate, Long> {

    // 관리자: 전체 목록 조회 (상태별 필터링)
    List<WriterCandidate> findByStatus(WriterCandidateStatus status);

    // 단건 조회: 특정 회원(userId)의 지원 상태 확인
    Optional<WriterCandidate> findByUserId(Long userId);

}
