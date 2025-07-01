package aipublish.domain;

import lombok.*;
import aipublish.infra.AbstractEvent;

@Data
@ToString
@NoArgsConstructor
public class BookMetadataUpdated extends AbstractEvent {

    private Long bookId;
    private String summary;
    private String coverImageUrl;
    private String category;
    private Integer price;

    public BookMetadataUpdated(Book book) {
        super(book);
        this.bookId = book.getBookId();
        this.summary = book.getSummary();
        this.coverImageUrl = book.getCoverImageUrl();
        this.category = book.getCategory();
        this.price = book.getPrice();
    }
}
