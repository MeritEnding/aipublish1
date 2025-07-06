package aipublish.service;

import org.springframework.web.reactive.function.client.WebClient;
import aipublish.domain.AIResult;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONObject;

@Service
@RequiredArgsConstructor
public class AiBookAutomationService {
    @Value("${openai.api-key}")
    private String openaiApiKey;

    @Value("${openai.endpoint}")
    private String openaiEndpoint;

    private final WebClient webClient = WebClient.builder().build();

    public AIResult generate(String title, String content) {
        // 1. gpt-3.5-turbo로 요약/카테고리/가격/영문 프롬프트 추출
        String prompt = "아래 책의 제목과 내용을 요약해줘. 그리고 반드시 아래 조건에 따라 작성해줘:\n\n" +
            "1. 요약: 책 내용을 한국어로 간결하게 요약해줘 (3~5문장).\n" +
            "2. 카테고리: 아래 중에서 가장 적절한 하나만 골라서 적어줘 (다른 카테고리는 금지)\n" +
            "   → [소설, 에세이, 자기계발, 경제, 인문, 과학]\n" +
            "3. 가격: 책의 길이와 품질을 고려하여 반드시 1,000 ~ 5,000원 사이의 정수 숫자만 적어줘 (단위는 '원' 생략하고 숫자만 작성해줘. 예: 3000)\n" +
            "4. 이미지 프롬프트: 책의 내용을 바탕으로 표지에 어울리는 일러스트 스타일의 그림을 영어로 묘사해줘. \n" +
            "   'an illustrated book cover of ...' 또는 'an emotional book cover showing ...' 형태로 자연스럽고 묘사적인 문장으로 써줘.\n" +
            "   사진처럼 보이기보다는 그림처럼 보이도록, illustration 또는 digital art 스타일로 묘사해줘.\n\n" +
            "출력 형식은 반드시 다음과 같아야 해:\n" +
            "- 요약: ...\n" +
            "- 카테고리: ...\n" +
            "- 가격: ...\n" +
            "- 이미지 프롬프트: ...\n\n" +
            "제목: " + title + "\n내용: " + content;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        List<Map<String, String>> messages = List.of(
            Map.of("role", "system", "content", "assistant는 한국어로 답변한다."),
            Map.of("role", "user", "content", prompt)
        );
        requestBody.put("messages", messages);

        // GPT 호출
        String response = WebClient.builder()
            .baseUrl(openaiEndpoint)
            .defaultHeader("Authorization", "Bearer " + openaiApiKey)
            .defaultHeader("Content-Type", "application/json")
            .build()
            .post()
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String.class)
            .block();

        JSONObject obj = new JSONObject(response);
        String answer = obj.getJSONArray("choices")
            .getJSONObject(0)
            .getJSONObject("message")
            .getString("content");

        // 정규표현식 파싱 (실제 답변 구조에 따라 조정)
        String summary = answer.replaceAll("(?s).*요약[:：]\\s*([^\n]+).*", "$1").trim();
        String category = answer.replaceAll("(?s).*카테고리[:：]\\s*([^\n]+).*", "$1").trim();
        String priceStr = answer.replaceAll("(?s).*가격[:：]\\s*([0-9]+).*", "$1").trim();
        String coverPrompt = answer.replaceAll("(?s).*이미지[ ]?프롬프트[:：]\\s*([^\n]+).*", "$1").trim();
        if(coverPrompt.isEmpty()) coverPrompt = "book cover, art";
        Integer price = null;
        try { price = Integer.parseInt(priceStr); } catch(Exception e){ price = 1000; }
        if (price < 1000 || price > 5000) {
            price = 3000;
        }

        // 2. DALL·E API로 이미지 생성
        String coverImageUrl = generateDalleImage(coverPrompt);

        return new AIResult(summary, coverImageUrl, category, price);
    }

    // DALL·E 2 API 호출 함수
        private String generateDalleImage(String prompt) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("prompt", prompt);
            requestBody.put("n", 1);
            requestBody.put("size", "512x512");
            requestBody.put("response_format", "url");

            System.out.println("DALL·E 요청 파라미터: " + requestBody);

            String response = WebClient.create("https://api.openai.com/v1/images/generations")
                    .post()
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JSONObject obj = new JSONObject(response);
            return obj.getJSONArray("data").getJSONObject(0).getString("url");
            } catch(Exception e) {
                    if (e instanceof org.springframework.web.reactive.function.client.WebClientResponseException) {
                    System.out.println("DALL·E 에러: " + ((org.springframework.web.reactive.function.client.WebClientResponseException) e).getResponseBodyAsString());
                    }
                    e.printStackTrace();
                    return "https://example.com/default-cover.jpg";
                }
        }
}
