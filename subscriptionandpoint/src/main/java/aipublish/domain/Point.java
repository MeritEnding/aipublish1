package aipublish.domain;

import aipublish.SubscriptionandpointApplication;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Point_table")
@Data
//<<< DDD / Aggregate Root
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long pointId;

    @Column(unique = true)  // 단일값만 가질 수 있게
    private Long userId;

    private Integer balance;

    public static PointRepository repository() {
        PointRepository pointRepository = SubscriptionandpointApplication.applicationContext.getBean(
            PointRepository.class
        );
        return pointRepository;
    }

    //<<< Clean Arch / Port Method
    public void deductPoint(DeductPointCommand command) {
        if (this.balance == null || this.balance < command.getAmount()) {
            throw new RuntimeException("포인트가 부족합니다.");
        }

        this.balance -= command.getAmount();

        PointDeducted event = new PointDeducted(this);
        event.setUserId(command.getUserId());
        event.setAmount(command.getAmount());
        event.setBookId(command.getBookId()); // 필요 시 추가
        event.publishAfterCommit();
    }
    //>>> Clean Arch / Port Method

    public void setAmount(Integer amount) {
    this.balance = amount;
    }

    public void grantWelcomePoint(Long userId, Integer amount) {
        this.userId = userId;
        this.balance = amount;

        WelcomePointGranted event = new WelcomePointGranted(this);
        event.publishAfterCommit();
}

}
//>>> DDD / Aggregate Root