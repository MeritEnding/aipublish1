package aipublish.infra;

import aipublish.config.kafka.KafkaProcessor;
import aipublish.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
public class PolicyHandler {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PointRepository pointRepository;

    @StreamListener(KafkaProcessor.INPUT)
    public void whatever(@Payload String eventString) {}

    /**
     * ✅ [수정] 회원가입 시 웰컴 포인트를 부여하는 로직
     */
    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='UserRegistered'"
    )
    public void wheneverUserRegistered_GrantWelcomePoint(@Payload UserRegistered event) {
        if (!event.validate()) return;
        System.out.println("##### listener UserRegistered - granting welcome point : " + event.toJson());

        // 1. 이미 해당 userId로 포인트 정보가 있는지 확인합니다.
        Optional<Point> existingPoint = pointRepository.findByUserId(event.getUserId());

        // 2. 포인트 정보가 없을 때만 새로 생성합니다.
        if (existingPoint.isEmpty()) {
            Point point = new Point();
            point.grantWelcomePoint(
                event.getUserId(),
                event.getIsKtCustomer() ? 5000 : 1000 // KT 고객 여부에 따라 포인트 차등 지급
            );
            pointRepository.save(point);
            System.out.println("Welcome point granted for userId: " + event.getUserId());
        } else {
            // 이미 포인트 정보가 있다면, 중복 생성을 방지하고 로그만 남깁니다.
            System.out.println("Point already exists for userId: " + event.getUserId() + ". Skipping welcome point grant.");
        }
    }
}