package aipublish.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.Data;

@Data
public class SubmitBookCommand {

    private Long bookId;
    private Long userId;
}
