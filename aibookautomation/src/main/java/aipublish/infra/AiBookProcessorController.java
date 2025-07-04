package aipublish.infra;

import aipublish.domain.AiBookProcessor;
import aipublish.domain.AiBookProcessorRepository;
import aipublish.domain.UpdateBookMetadataCommand;
import aipublish.service.AiBookProcessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class AiBookProcessorController {

    private final AiBookProcessorRepository repo;
    private final AiBookProcessorService processorService;

    // 출간 요청 최초 등록
    @PostMapping("/aiBookProcessors")
    public ResponseEntity<?> create(@RequestBody AiBookProcessor req) {
        req.setProcessStatus("READY");
        req.setCreatedAt(LocalDateTime.now());
        repo.save(req);
        return ResponseEntity.ok(req);
    }

    // AI 자동화 트리거 → 서비스에 위임
    @PostMapping("/aiBookProcessors/{id}/startaipublishing")
    public ResponseEntity<?> startAiPublishing(@PathVariable Long id) {
        AiBookProcessor result = processorService.process(id);
        return ResponseEntity.ok(result);
    }

    // AI 처리 결과 수동 반영 (선택)
    @PostMapping("/aiBookProcessors/{id}/updatebookmetadata")
    public ResponseEntity<?> updateBookMetadata(
            @PathVariable Long id,
            @RequestBody UpdateBookMetadataCommand cmd) {

        AiBookProcessor req = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("출간 요청 없음"));

        if (cmd.getBookId() != null) req.setBookId(cmd.getBookId());
        if (cmd.getSummary() != null) req.setSummary(cmd.getSummary());
        if (cmd.getCoverImageUrl() != null) req.setCoverImageUrl(cmd.getCoverImageUrl());
        if (cmd.getCategory() != null) req.setCategory(cmd.getCategory());
        if (cmd.getPrice() != null) req.setPrice(cmd.getPrice());

        req.setProcessStatus("COMPLETE");
        repo.save(req);

        return ResponseEntity.ok(req);
    }

    // 단일 출간 요청 조회
    @GetMapping("/aiBookProcessors/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
