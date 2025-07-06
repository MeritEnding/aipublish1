package aipublish.domain;

import aipublish.domain.*;
import aipublish.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class SavedBookCommand extends AbstractEvent {

    private Long bookId;
    private Long userId;
    private String title;
    private String content;
    private String summary;
    private String coverImageUrl;
    private String category;
    private Integer price;
    private String status;
    private Integer viewCount;
    private Date createdAt;
    // private AiBookProcessorId aiBookProcessorId;

    public SavedBookCommand(Book aggregate) {
        super(aggregate);
    }

    public SavedBookCommand() {
        super();
    }
}
//>>> DDD / Domain Event
