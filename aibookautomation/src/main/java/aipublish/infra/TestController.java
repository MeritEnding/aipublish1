package aipublish.infra;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/test")
public class TestController {

    private final AiEventListener aiEventListener;

    public TestController(AiEventListener aiEventListener) {
        this.aiEventListener = aiEventListener;
    }

    @PostMapping("/handleBookSubmitted")
    public ResponseEntity<String> testHandleBookSubmitted(@RequestBody String message) {
        try {
            aiEventListener.handleBookSubmitted(message);
            return ResponseEntity.ok("Handled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error: " + e.getMessage());
        }
    }

    //url 테스트
    @PostMapping("/generateCover")
    public ResponseEntity<String> generateCover(@RequestBody String message) {
        try {
            String coverUrl = aiEventListener.generateCoverImageFromMessage(message);
            return ResponseEntity.ok(coverUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error: " + e.getMessage());
        }
    }
}
