package aipublish.domain;

import aipublish.domain.*;
import aipublish.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class WelcomePointGranted extends AbstractEvent {

    private Long userId;
    private Integer amount;

    public WelcomePointGranted(User user, Integer amount) {
        super(user);
        this.userId = user.getId();
        this.amount = amount;
    }

    public WelcomePointGranted(Point point) {
    super(point); // Optional: AbstractEvent가 aggregate 받으면
    this.userId = point.getUserId();
    this.amount = point.getBalance(); // 또는 point.getAmount() 이름에 맞게
}

    public WelcomePointGranted() {
        super();
    }
}
//>>> DDD / Domain Event
