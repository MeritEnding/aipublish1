package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "purchaseServiceClient", url = "https://8083-meritending-aipublish1-uhq7q346trw.ws-us120.gitpod.io")
public interface PurchaseServiceClient {

    @GetMapping("/purchases/check")
    boolean hasPurchased(@RequestParam("userId") Long userId, @RequestParam("bookId") Long bookId);

    @PostMapping("/purchases")
    void recordPurchase(@RequestParam("userId") Long userId, @RequestParam("bookId") Long bookId);

    @GetMapping("/purchases/user/{userId}")
    List<Long> getPurchasedBookIds(@PathVariable("userId") Long userId);
}
