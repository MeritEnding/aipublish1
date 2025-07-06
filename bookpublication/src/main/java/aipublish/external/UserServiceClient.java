package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
    name = "userServiceClient",
    url = "${external.user-service.url}"
)
public interface UserServiceClient {

    @GetMapping("/users/{id}/isAdmin")
    boolean isAdmin(@PathVariable("id") Long userId);
}
