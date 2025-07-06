package aipublish.domain;

import lombok.Data;

@Data
public class UpdateBookMetadataCommand {

    private String summary;
    private String coverImageUrl;
    private String category;
    private Integer price;
    private Long bookId;
}
