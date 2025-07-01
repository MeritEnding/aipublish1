package aipublish.domain;

import aipublish.BookpublicationApplication;
import aipublish.domain.BookMetadataUpdated;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Book_table")
@Data
//<<< DDD / Aggregate Root
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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

    // @Embedded
    // private AiBookProcessorId aiBookProcessorId;

    public static BookRepository repository() {
        BookRepository bookRepository = BookpublicationApplication.applicationContext.getBean(
            BookRepository.class
        );
        return bookRepository;
    }

    public void SubmitManuscript() {
        //
    }
    // 출간 요청
    public void submitBookCommand(
        SubmitBookCommand submitBookCommandCommand
    ) {
        this.status = "SUBMITTED"; // 상태 변경
        BookSubmittedEvent event = new BookSubmittedEvent(this);
        event.publishAfterCommit(); // 출간 요청 이벤트 발행
    }

    // 도서 저장
    public void saveBookCommand(SaveBookCommand saveBookCommand) {
        this.userId = saveBookCommand.getUserId();
        this.title = saveBookCommand.getTitle();
        this.content = saveBookCommand.getContent();
        this.status = "DRAFT";
        this.viewCount = 0;
        this.createdAt = new Date();

        SavedBookCommand event = new SavedBookCommand(this);
        event.publishAfterCommit();
        }
    
    // 메타데이터 업데이트
    public void updateBookMetadata(UpdateBookMetadataCommand command) {
        this.summary = command.getSummary();
        this.coverImageUrl = command.getCoverImageUrl();
        this.category = command.getCategory();
        this.price = command.getPrice();
        this.status = "PUBLISHED";
        this.createdAt = new Date();

        BookMetadataUpdated event = new BookMetadataUpdated(this);
        event.publishAfterCommit();
}

}
//>>> DDD / Aggregate Root
