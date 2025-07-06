
package aipublish.infra;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class AiEventListener {

    private final ImageGenerator imageGenerator;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 생성자 주입 (Spring이 관리)
    public AiEventListener(ImageGenerator imageGenerator, KafkaTemplate<String, String> kafkaTemplate) {
        this.imageGenerator = imageGenerator;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "BookSubmitted", groupId = "ai-group")
    public void handleBookSubmitted(String message) throws Exception {
        var json = objectMapper.readTree(message);
        Long bookId = json.get("bookId").asLong();
        String title = json.get("title").asText();

        // 이미지 생성
        String coverUrl = imageGenerator.generateCoverImage(title);

        // CoverGenerated 이벤트 생성
        Map<String, Object> coverEvent = Map.of(
            "bookId", bookId,
            "coverImageUrl", coverUrl
        );

        //카프카 이벤트발행 부분인데, 이벤트스토밍에는 없어서 우선은 주석처리.
        // String coverEventJson = objectMapper.writeValueAsString(coverEvent);
        // kafkaTemplate.send("CoverGenerated", coverEventJson);
    }

    //url 테스트
    public String generateCoverImageFromMessage(String message) throws Exception {
    var json = objectMapper.readTree(message);
    String title = json.get("title").asText();
    return imageGenerator.generateCoverImage(title);
}
}

