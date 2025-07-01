package aipublish.infra;

import aipublish.config.kafka.KafkaProcessor;
import aipublish.domain.*;
import aipublish.service.AiBookProcessorService;
import java.time.LocalDateTime;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PolicyHandler {

    @Autowired
    AiBookProcessorRepository aiBookProcessorRepository;

    @Autowired
    AiBookProcessorService aiBookProcessorService;

    @StreamListener(KafkaProcessor.INPUT)
    public void whatever(@Payload String eventString) {}

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='BookSubmittedEvent'"
    )
    public void wheneverBookSubmittedEvent_TriggerAiPublishingOnBookSubmit(
        @Payload BookSubmittedEvent event
    ) {
        System.out.println(
            "\n\n##### listener TriggerAiPublishingOnBookSubmit : " + event + "\n\n"
        );

        // 1. AI Processor 엔티티 생성 및 저장
        AiBookProcessor processor = new AiBookProcessor();
        processor.setBookId(event.getBookId());
        processor.setTitle(event.getTitle());
        processor.setContent(event.getContent());
        processor.setProcessStatus("READY");
        processor.setCreatedAt(LocalDateTime.now());

        aiBookProcessorRepository.save(processor);

        // 2. Service 통해 자동화 처리 실행
        try {
            aiBookProcessorService.process(processor.getId());
        } catch (Exception e) {
            System.out.println("AI 자동화 처리 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
