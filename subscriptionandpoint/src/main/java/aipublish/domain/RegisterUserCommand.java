package aipublish.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.Data;

@Data
public class RegisterUserCommand {
    private String name;
    private String email;
    private String passwordHash; // 프론트엔드에서 보낸 비밀번호를 이 필드로 받습니다.
    private Boolean isKtCustomer;
    private Boolean subscription;
    private Boolean isAdmin;
}