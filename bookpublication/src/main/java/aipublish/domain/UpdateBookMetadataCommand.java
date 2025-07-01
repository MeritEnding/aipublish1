package aipublish.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class UpdateBookMetadataCommand {

    private String summary;
    private String coverImageUrl;
    private String category;
    private Integer price;
    private Long bookId;
}
