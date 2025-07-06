package aipublish.infra;

import aipublish.config.kafka.KafkaProcessor;
import aipublish.domain.WriterStatusChangedEvent;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.stereotype.Service;

@Service
public class WriterStatusChangedHandler {

    @StreamListener(KafkaProcessor.INPUT)
    public void handleWriterStatusChanged(WriterStatusChangedEvent event) {
        System.out.println(" WriterStatusChangedEvent: " + event);

    }
}
