package aipublish.external;

import lombok.Data;

@Data
public class DeductPointCommand {
    private Long userId;
    private Integer amount;
    private String reason; // 예: "도서 열람"
}
