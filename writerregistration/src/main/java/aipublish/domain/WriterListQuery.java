package aipublish.domain;

import java.util.Date;
import lombok.Data;

@Data
public class WriterListQuery {

    private Long id;
    private String name;
    private String status;
    private Date createdAt;
}
