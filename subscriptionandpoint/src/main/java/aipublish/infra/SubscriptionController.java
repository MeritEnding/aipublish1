package aipublish.infra;

import aipublish.domain.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
