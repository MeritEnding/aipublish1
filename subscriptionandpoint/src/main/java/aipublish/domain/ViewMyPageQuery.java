package aipublish.domain;

import java.util.Date;
import lombok.Data;

@Data
public class ViewMyPageQuery {

    private Long id;
    private String name;
    private String email;
    private Boolean subscription;
    // private Long bookId;
}
