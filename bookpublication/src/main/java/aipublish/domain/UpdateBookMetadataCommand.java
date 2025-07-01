package aipublish.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.Data;

@Data
public class UpdateBookMetadataCommand {

    private Long bookId;
    private Date createdAt;
    private String summary;
    private String coverImageUrl;
    private String category;
    private Integer price;
}
