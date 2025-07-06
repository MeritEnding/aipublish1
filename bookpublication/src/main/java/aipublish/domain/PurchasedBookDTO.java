package aipublish.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PurchasedBookDTO {
    private Long bookId;
    private String title;
    private String coverImageUrl;
}
