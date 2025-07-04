package aipublish.infra;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class ImageGenerator {

    @Value("${openai.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateCoverImage(String prompt) {
        System.out.println("OpenAI API Key = '" + apiKey + "'"); // api 키 확인용
        String url = "https://api.openai.com/v1/images/generations";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = Map.of(
            "model", "dall-e-3",
            "prompt", prompt,
            "n", 1,
            "size", "1024x1024"
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> body = response.getBody();
            List<Map<String, String>> data = (List<Map<String, String>>) body.get("data");
            return data.get(0).get("url");
        } else {
            throw new RuntimeException("Failed to generate image: " + response.getStatusCode());
        }
    }
}
