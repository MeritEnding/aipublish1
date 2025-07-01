package aipublish.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.Data;

@Data
public class DeductPointCommand {

    private Long userId;
    private Long pointId;
    private Integer amount;
    private Long bookId;
}
