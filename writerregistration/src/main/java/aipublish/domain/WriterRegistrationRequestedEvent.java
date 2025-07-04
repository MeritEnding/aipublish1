package aipublish.domain;

import aipublish.domain.WriterCandidate;
import aipublish.infra.AbstractEvent;
import lombok.*;

@Data
@ToString
public class WriterRegistrationRequestedEvent extends AbstractEvent {

    private Long userId;
    private String name;
    private String email;
    private String bio;
    private String status;

    public WriterRegistrationRequestedEvent(WriterCandidate candidate) {
        super(candidate);
        this.userId = candidate.getUserId();
        this.name = candidate.getName();
        this.email = candidate.getEmail();
        this.bio = candidate.getBio();
        this.status = candidate.getStatus().toString();
    }

    public WriterRegistrationRequestedEvent() {
        super();
    }
}
