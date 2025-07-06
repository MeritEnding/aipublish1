package aipublish.infra;

import aipublish.domain.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/{userId}/status")
    public boolean isSubscribed(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getSubscription() != null && user.getSubscription())
                .orElse(false);
    }
    // 구독 활성화
    @PostMapping("/activate")
    public ResponseEntity<?> activateSubscription(@RequestParam Long userId) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setSubscription(true);
                userRepository.save(user);
                return ResponseEntity.ok("구독이 활성화되었습니다.");
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다."));
    }
    // 구독취소
    @PostMapping("/deactivate")
    public ResponseEntity<?> deactivateSubscription(@RequestParam Long userId) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setSubscription(false);
                userRepository.save(user);
                return ResponseEntity.ok("구독이 취소되었습니다.");
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다."));
    }
}