package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
    name = "subscriptionServiceClient",
    url = "https://8083-meritending-aipublish1-uhq7q346trw.ws-us120.gitpod.io" // subscriptionandpoint 서비스 주소
)
public interface SubscriptionServiceClient {

    @GetMapping("/subscriptions/{userId}/status")
    boolean isSubscribed(@PathVariable("userId") Long userId);
}
