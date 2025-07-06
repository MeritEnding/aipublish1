package aipublish.domain;

import aipublish.BookpublicationApplication;
import aipublish.domain.BookMetadataUpdated;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;

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
    
    @Column(columnDefinition = "TEXT") 
    private String content;

    private String summary;
    
    @Column(length = 1000) 
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

    public void generateAndSetMetadata() {
        // 1. 요약 생성 (본문 앞 100자 + "...")
        if (this.content != null && !this.content.isEmpty()) {
            this.summary = this.content.length() > 100
                ? this.content.substring(0, 100) + "..."
                : this.content;
        } else {
            this.summary = "요약 정보가 없습니다.";
        }

        // 2. 카테고리 랜덤 선택
        String[] categories = {"문학", "과학", "역사", "예술", "기술", "기타"};
        this.category = categories[new Random().nextInt(categories.length)];

        // 3. 가격 랜덤 설정 (1000 ~ 5000 포인트)
        this.price = 1000 + new Random().nextInt(4001);

        // 4. 기본 커버 이미지 URL 설정
        this.coverImageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop";

        // 5. 상태를 'PUBLISHED'로 변경 (메타데이터 생성이 완료되었으므로)
        this.status = "PUBLISHED";
    }


    // [변경] 도서 저장 메소드 수정
    public void saveBookCommand(SaveBookCommand saveBookCommand) {
        // 기존 로직: 기본 정보 설정
        this.userId = saveBookCommand.getUserId();
        this.title = saveBookCommand.getTitle();
        this.content = saveBookCommand.getContent();
        this.viewCount = 0;
        this.createdAt = new Date();
        // this.status = "DRAFT"; // DRAFT 상태 대신 바로 메타데이터 생성 후 PUBLISHED로 변경

        // [추가] AI 메타데이터 생성 로직 즉시 호출
        generateAndSetMetadata();

        // 이벤트 발행
        SavedBookCommand event = new SavedBookCommand(this);
        event.publishAfterCommit();
    }
    
    // 메타데이터 업데이트
    public void updateBookMetadata(UpdateBookMetadataCommand command) {
        System.out.println(">>> [updateBookMetadata] called with: " + command);
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
