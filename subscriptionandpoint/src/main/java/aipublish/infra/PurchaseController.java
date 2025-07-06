package aipublish.infra;

import aipublish.domain.BookPurchaseLog;
import aipublish.domain.BookPurchaseLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/purchases")
public class PurchaseController {

    @Autowired
    BookPurchaseLogRepository bookPurchaseLogRepository;

    @GetMapping("/check")
    public boolean hasPurchasedBook(@RequestParam("userId") Long userId,
                                    @RequestParam("bookId") Long bookId) {
        return bookPurchaseLogRepository.existsByUserIdAndBookId(userId, bookId);
    }

    @PostMapping
    public void recordBookPurchase(@RequestParam("userId") Long userId,
                                    @RequestParam("bookId") Long bookId) {
        BookPurchaseLog log = new BookPurchaseLog();
        log.setUserId(userId);
        log.setBookId(bookId);
        log.setPurchasedAt(new Date());
        bookPurchaseLogRepository.save(log);
    }

    @GetMapping("/user/{userId}")
    public List<Long> getPurchasedBookIds(@PathVariable Long userId) {
        return bookPurchaseLogRepository.findBookIdsByUserId(userId);
    }
}
