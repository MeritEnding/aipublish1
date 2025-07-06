package aipublish.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.Data;

@Data
public class RegisterUserCommand {

    private String name;
    private String email;
    private String passwordHash;
    private Boolean isKtCustomer;
    private Boolean subscription;
    private Boolean isAdmin; // 관리자 여부 추가
}
