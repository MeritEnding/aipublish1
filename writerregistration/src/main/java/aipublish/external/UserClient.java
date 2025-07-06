package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "userService", url = "${external.user-service.url}")
public interface UserClient {

    @GetMapping("/users/{id}/views")
    UserDto getUser(@PathVariable("id") Long id);

    @GetMapping("/users/{id}/isAdmin")
    boolean isAdmin(@PathVariable("id") Long id);
}
