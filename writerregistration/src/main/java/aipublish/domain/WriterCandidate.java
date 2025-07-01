package aipublish.domain;

import aipublish.WriterregistrationApplication;
import aipublish.external.UserDto;
import java.util.Date;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "WriterCandidate")
@Data
public class WriterCandidate {

    @Id
    private Long userId; // 회원 ID를 직접 받음 (PK로 사용)

    private String name;
    private String email;
    private String bio;

    @Enumerated(EnumType.STRING)
    private WriterCandidateStatus status;

    private Date createdAt;

    @PrePersist
    public void onPrePersist() {
        this.status = WriterCandidateStatus.PENDING;
        this.createdAt = new Date();
    }

    // 등록 요청 처리 메서드
    public void apply(String bio, UserDto user) {
        this.userId = user.getId();  // userId 외부에서 주입
        this.name = user.getName();
        this.email = user.getEmail();
        this.bio = bio;
        this.status = WriterCandidateStatus.PENDING;
    }

    // 상태 변경 처리 메서드
    public void changeStatus(String status) {
        this.status = WriterCandidateStatus.valueOf(status.toUpperCase());
    }

    public static WriterCandidateRepository repository() {
        return WriterregistrationApplication.applicationContext.getBean(
            WriterCandidateRepository.class
        );
    }

    public WriterRegistrationRequestedEvent toRequestedEvent() {
        return new WriterRegistrationRequestedEvent(this);
    }

    public WriterStatusChangedEvent toStatusChangedEvent() {
        return new WriterStatusChangedEvent(this);
    }
}
