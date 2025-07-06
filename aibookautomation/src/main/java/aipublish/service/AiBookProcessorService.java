package aipublish.service;

import aipublish.domain.AiBookProcessor;
import aipublish.domain.AiBookProcessorRepository;
import aipublish.domain.AIResult;
import aipublish.domain.UpdateBookMetadataCommand;
import aipublish.external.BookServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AiBookProcessorService {

    private final AiBookProcessorRepository repo;
    private final AiBookAutomationService aiService;
    private final BookServiceClient bookServiceClient;

    public AiBookProcessor process(Long id) {
        AiBookProcessor req = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("출간 요청 없음"));

        req.setProcessStatus("PROCESSING");

        // 1. AI 생성
        AIResult ai = aiService.generate(req.getTitle(), req.getContent());

        // 2. 결과 저장
        req.setSummary(ai.getSummary());
        req.setCoverImageUrl(ai.getCoverImageUrl());
        req.setCategory(ai.getCategory());
        req.setPrice(ai.getPrice());
        req.setProcessStatus("COMPLETE");
        req.setCreatedAt(LocalDateTime.now());
        repo.save(req);

        // 3. Book 서비스에 전송
        UpdateBookMetadataCommand cmd = new UpdateBookMetadataCommand();
        cmd.setBookId(req.getBookId());
        cmd.setSummary(req.getSummary());
        cmd.setCoverImageUrl(req.getCoverImageUrl());
        cmd.setCategory(req.getCategory());
        cmd.setPrice(req.getPrice());

        bookServiceClient.updateBookMetadata(cmd);

        return req;
    }
}
