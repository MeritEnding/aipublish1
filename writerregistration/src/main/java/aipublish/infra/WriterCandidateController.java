package aipublish.infra;

import aipublish.domain.*;
import aipublish.external.UserClient;
import aipublish.external.UserDto;
import java.util.Optional;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Transactional
public class WriterCandidateController {

    @Autowired
    private WriterCandidateRepository writerCandidateRepository;

    @Autowired
    private UserClient userClient;

    /**
     * 작가 등록 신청 API
     */
    @PostMapping("/writers/apply")
    public WriterCandidate applyWriter(@RequestBody ApplyWriterRegistrationCommand command) {
        // 1. userId 기반으로 회원 정보 조회
        UserDto user = userClient.getUser(command.getUserId());

        // 2. WriterCandidate 생성 및 데이터 설정
        WriterCandidate candidate = new WriterCandidate();
        candidate.apply(command.getBio(), user);

        // 3. 저장 및 이벤트 발행
        writerCandidateRepository.save(candidate);
        candidate.toRequestedEvent().publishAfterCommit();

        return candidate;
    }

    /**
     * 관리자 작가 상태 변경 API
     */
    @PatchMapping("/admin/writers/{userId}/status")
    public WriterCandidate changeWriterStatus(
        @PathVariable Long userId,
        @RequestParam("adminId") Long adminId,  // 요청자 (관리자) ID
        @RequestBody ChangeWriterStatusCommand command
    ) {
        // 관리자 확인
        if (!userClient.isAdmin(adminId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 작가 상태를 변경할 수 있습니다.");
        }

        // 작가 상태 변경
        WriterCandidate candidate = writerCandidateRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("지원자를 찾을 수 없습니다."));

        candidate.changeStatus(command.getStatus());
        writerCandidateRepository.save(candidate);
        candidate.toStatusChangedEvent().publishAfterCommit();

        return candidate;
    }

    @GetMapping("/admin/writers")
    public List<WriterCandidate> getPendingWriters(@RequestParam("adminId") Long adminId) {
        // 1. 관리자 권한 확인
        if (!userClient.isAdmin(adminId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 접근할 수 있습니다.");
        }

        // 2. 승인 대기중인 작가 리스트 반환
        return writerCandidateRepository.findByStatus(WriterCandidateStatus.PENDING);
    }

    @GetMapping("/writers/{userId}/isApproved")
    public boolean isApprovedWriter(@PathVariable Long userId) {
        return writerCandidateRepository.findByUserId(userId)
            .map(candidate -> candidate.getStatus() == WriterCandidateStatus.APPROVED)
            .orElse(false);
    }
}
