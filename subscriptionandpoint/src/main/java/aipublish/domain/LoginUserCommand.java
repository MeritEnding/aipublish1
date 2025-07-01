package aipublish.domain;

import lombok.Data;

@Data
public class LoginUserCommand {
    private String email;
    private String passwordHash;
}
