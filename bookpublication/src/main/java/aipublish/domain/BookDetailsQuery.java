package aipublish.domain;

import java.util.Date;
import lombok.Data;

@Data
public class BookDetailsQuery {

    private Long bookId;
    private String title;
    private Long userId;
    private String content;
    private String summary;
    private String coverImageUrl;
    private String category;
    private Integer price;
    private String status;
    private Integer viewCount;
    private Date createdAt;
}
