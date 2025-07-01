package aipublish.infra;

import aipublish.config.kafka.KafkaProcessor;
import aipublish.domain.*;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

//<<< Clean Arch / Inbound Adaptor

@RestController
@Transactional
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PointRepository pointRepository;

    @Autowired
    KafkaProcessor kafkaProcessor;

    // 회원가입
    // 회원가입 API
    @PostMapping("/users/registeruser")
    public User registerUser(@RequestBody RegisterUserCommand command) {
        User user = new User();
        user.setName(command.getName());
        user.setEmail(command.getEmail());
        
        // ✅ 핵심 수정: command 객체에서 passwordHash 값을 가져와 user 엔티티에 저장합니다.
        user.setPasswordHash(command.getPasswordHash());
        
        userRepository.save(user);

        // 이벤트 발행
        new UserRegistered(user).publishAfterCommit();
        return user;
    }

    // 로그인 API
    @PostMapping("/users/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginUserCommand command) {
        // 이메일로 사용자를 찾습니다. (null일 수 있음)
        User user = userRepository.findByEmail(command.getEmail());

        // 사용자가 존재하고, 요청된 passwordHash와 DB의 passwordHash가 일치하는지 확인합니다.
        if (user != null && user.getPasswordHash().equals(command.getPasswordHash())) {
            
            // 로그인 성공: 임시 토큰을 생성합니다.
            String token = "dummy-jwt-token-for-" + user.getEmail();

            // 프론트엔드가 기대하는 {"token": "..."} 형태의 JSON 응답을 만듭니다.
            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            // 200 OK 상태와 함께 토큰이 담긴 JSON을 반환합니다.
            return ResponseEntity.ok(response);
        }

        // 사용자가 없거나 비밀번호가 틀리면 401 Unauthorized 에러를 반환합니다.
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    

    // 사용자 정보 단건 조회 (마이페이지용)
    @GetMapping(value = "/users/{id}/views", produces = "application/json;charset=UTF-8")
    public User getUserView(@PathVariable("id") Long id) throws Exception {
        System.out.println("##### /users/{id}/views called, id: " + id);

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found with id: " + id);
        }

        return userOpt.get();
    }
    @GetMapping("/users/{id}/isAdmin")
    public boolean isAdmin(@PathVariable("id") Long userId) {
        return userRepository.findById(userId)
                .map(User::isAdmin)
                .orElse(false);
    }
}
//>>> Clean Arch / Inbound Adaptor
