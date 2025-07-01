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
    @PostMapping(value = "/users/registeruser", produces = "application/json;charset=UTF-8")
public User registerUser(
    HttpServletRequest request,
    HttpServletResponse response,
    @RequestBody RegisterUserCommand registerUserCommand
) throws Exception {
    System.out.println("##### /user/registerUser  called #####");

    User user = new User();
    user.registerUser(registerUserCommand);
    userRepository.save(user);

    // 포인트는 WelcomePointGranted 이벤트 수신 후 생성됨

    UserRegistered event = new UserRegistered(user);
    event.setUserId(user.getId());
    event.setName(user.getName());
    event.setEmail(user.getEmail());
    event.setIsKtCustomer(user.getIsKtCustomer());
    event.publishAfterCommit();

    return user;
}

    // 로그인 API
    @PostMapping("/users/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginUserCommand command) {
        User user = userRepository.findByEmail(command.getEmail());

        if (user == null || !user.getPasswordHash().equals(command.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("isAdmin", user.getIsAdmin());

        return ResponseEntity.ok(result);
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
