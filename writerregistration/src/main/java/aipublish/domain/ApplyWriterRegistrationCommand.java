package aipublish.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.Data;

@Data
public class ApplyWriterRegistrationCommand {

    private Long userId; // 프론트에서 전달
    private String bio;  // 소개글
}
