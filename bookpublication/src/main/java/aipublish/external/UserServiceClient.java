package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
    name = "userServiceClient",
    url = "https://8083-meritending-aipublish1-uhq7q346trw.ws-us120.gitpod.io"
)
public interface UserServiceClient {

    @GetMapping("/users/{id}/isAdmin")
    boolean isAdmin(@PathVariable("id") Long userId);
}
