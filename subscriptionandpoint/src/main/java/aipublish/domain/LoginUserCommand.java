package aipublish.domain;

import lombok.Data;

@Data
public class LoginUserCommand {
    private String email;
    private String passwordHash; // 프론트엔드에서 보낸 비밀번호를 이 필드로 받습니다.
}