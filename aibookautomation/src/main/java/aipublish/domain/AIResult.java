package aipublish.domain;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIResult {
    private String summary;
    private String coverImageUrl;
    private String category;
    private Integer price;
}
