package aipublish.infra;

import aipublish.domain.*;
import aipublish.external.UserServiceClient;
import aipublish.external.SubscriptionServiceClient;
import aipublish.external.PointServiceClient;
import aipublish.external.PurchaseServiceClient;
import aipublish.external.DeductPointCommand;
import aipublish.external.WriterServiceClient;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;


//<<< Clean Arch / Inbound Adaptor

@RestController
// @RequestMapping(value="/books")
@Transactional
public class BookController {

@Autowired
    BookRepository bookRepository;

@Autowired
UserServiceClient userServiceClient;

@Autowired
SubscriptionServiceClient subscriptionServiceClient;

@Autowired
PointServiceClient pointServiceClient;

@Autowired
PurchaseServiceClient purchaseServiceClient;

@Autowired
WriterServiceClient writerServiceClient;

    @PostMapping("/books/savebookcommand")
    public Book saveBookCommand(@RequestBody SaveBookCommand command) {
        System.out.println("##### /books/savebookcommand called #####");

        boolean isApprovedWriter = writerServiceClient.isApprovedWriter(command.getUserId());
        if (!isApprovedWriter) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "승인된 작가만 글을 작성할 수 있습니다.");
        }

        Book book = new Book();
        book.saveBookCommand(command);
        return bookRepository.save(book);
    }

    @PostMapping("/books/submitbookcommand")
    public Book submitBookCommand(@RequestBody SubmitBookCommand command) throws Exception {
        System.out.println("##### /books/submitbookcommand called #####");

        Optional<Book> optionalBook = bookRepository.findById(command.getBookId());
        if (!optionalBook.isPresent()) {
            throw new Exception("Book not found with id: " + command.getBookId());
        }

        Book book = optionalBook.get();
        book.submitBookCommand(command); // 상태 변경 및 이벤트 발행
        return bookRepository.save(book); // 갱신된 Book 저장
    }

    @PostMapping("/books/updatemetadata")
    public Book updateBookMetadata(@RequestBody UpdateBookMetadataCommand command) {
        System.out.println("##### /books/updatemetadata called #####");
        System.out.println(">>> 받은 값: bookId=" + command.getBookId());
        System.out.println(">>> summary=" + command.getSummary());
        System.out.println(">>> coverImageUrl=" + command.getCoverImageUrl());
        System.out.println(">>> category=" + command.getCategory());
        System.out.println(">>> price=" + command.getPrice());

        Optional<Book> optionalBook = bookRepository.findById(command.getBookId());
        if (optionalBook.isPresent()) {
            Book book = optionalBook.get();
            book.updateBookMetadata(command);
            return bookRepository.save(book);
        } else {
            throw new RuntimeException("Book not found with ID: " + command.getBookId());
        }
    }

    // 출간된 전체 도서 목록 조회
    @GetMapping("/books")
    public Iterable<Book> getBooksByStatus(@RequestParam(required = false) String status) {
        if (status != null) {
            return bookRepository.findByStatus(status.toUpperCase());
        } else {
            return bookRepository.findAll(); // 이제 타입 불일치 없음
        }
    }
    // 베스트셀러 목록 조회
    @GetMapping("/books/bestsellers")
    public List<Book> getBestsellers() {
        return bookRepository.findBestsellers();
    }

    //  도서 열람
    @GetMapping("/books/{id}")
    public Book getBookDetails(
        @PathVariable Long id,
        @RequestParam("userId") Long userId
    ) {
        Optional<Book> optionalBook = bookRepository.findById(id);

        if (optionalBook.isEmpty()) {
            throw new RuntimeException("Book not found with ID: " + id);
        }

        Book book = optionalBook.get();

        // 1. 구독 여부 확인
        boolean subscribed = subscriptionServiceClient.isSubscribed(userId);

        // 2. 구독자가 아닌 경우 구매 여부 확인
        if (!subscribed) {
            boolean hasPurchased = purchaseServiceClient.hasPurchased(userId, id);

            if (!hasPurchased) {
                // 포인트 차감
                DeductPointCommand command = new DeductPointCommand();
                command.setUserId(userId);
                command.setAmount(book.getPrice());  // 책 가격만큼 차감
                command.setReason("도서 구매");

                try {
                    pointServiceClient.deductPoint(command);
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "포인트 부족 혹은 차감 실패");
                }

                // 구매 기록 저장
                purchaseServiceClient.recordPurchase(userId, id);
            }
        }

        // 3. 조회수 증가 및 저장
        book.setViewCount(book.getViewCount() + 1);
        return bookRepository.save(book);
    }

    @DeleteMapping("/books/{id}")
    public void deleteBook(@PathVariable Long id, @RequestParam("userId") Long userId) {
        // 1. 관리자 확인
        boolean isAdmin = userServiceClient.isAdmin(userId);
        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 도서를 삭제할 수 있습니다.");
        }

        // 2. 도서 삭제
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            bookRepository.deleteById(id);
            System.out.println("Book with ID " + id + " deleted.");
        } else {
            throw new RuntimeException("Book not found with ID: " + id);
        }
    }
    @GetMapping("/books/purchased")
    public List<PurchasedBookDTO> getPurchasedBooks(@RequestParam Long userId) {
        List<Long> purchasedBookIds = purchaseServiceClient.getPurchasedBookIds(userId);

        Iterable<Book> books = bookRepository.findAllById(purchasedBookIds);

        return StreamSupport.stream(books.spliterator(), false)
            .map(book -> new PurchasedBookDTO(
                book.getBookId(),
                book.getTitle(),
                book.getCoverImageUrl()
            ))
            .collect(Collectors.toList());
    }
//>>> Clean Arch / Inbound Adaptor
    }

    