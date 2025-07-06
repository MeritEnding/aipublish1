package aipublish.domain;

import lombok.Data;

@Data
public class GrantPointCommand {
    private Long userId;
    private Integer amount;
}