// WriterStatusChangedEvent.java

package aipublish.domain;

import aipublish.infra.AbstractEvent;
import lombok.*;

@Data
@ToString
public class WriterStatusChangedEvent extends AbstractEvent {

    private Long userId;
    private String name;
    private String email;
    private String bio;
    private String status;

    public WriterStatusChangedEvent(WriterCandidate aggregate) {
        super(aggregate);
        if (aggregate != null) {
            this.userId = aggregate.getUserId();
            this.name = aggregate.getName();
            this.email = aggregate.getEmail();
            this.bio = aggregate.getBio();
            if (aggregate.getStatus() != null) {
                this.status = aggregate.getStatus().toString();
            }
        }
    }

    public WriterStatusChangedEvent() {
        super();
    }
}
