package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
    name = "subscriptionServiceClient",
    url = "${external.user-service.url}" 
)
public interface SubscriptionServiceClient {

    @GetMapping("/subscriptions/{userId}/status")
    boolean isSubscribed(@PathVariable("userId") Long userId);
}
