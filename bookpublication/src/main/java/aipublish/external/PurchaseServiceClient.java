package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "purchaseServiceClient", url = "${external.user-service.url}")
public interface PurchaseServiceClient {

    @GetMapping("/purchases/check")
    boolean hasPurchased(@RequestParam("userId") Long userId, @RequestParam("bookId") Long bookId);

    @PostMapping("/purchases")
    void recordPurchase(@RequestParam("userId") Long userId, @RequestParam("bookId") Long bookId);

    @GetMapping("/purchases/user/{userId}")
    List<Long> getPurchasedBookIds(@PathVariable("userId") Long userId);
}
