package aipublish.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.Data;

@Data
public class SaveBookCommand {

    private Long bookId;
    private Long userId;
    private String title;
    private String content;
    private String status;
}

