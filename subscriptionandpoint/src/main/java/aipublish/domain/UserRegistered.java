package aipublish.domain;

import aipublish.domain.*;
import aipublish.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class UserRegistered extends AbstractEvent {

    private Long userId;
    private String name;
    private String email;
    private String passwordHash;
    private Boolean isKtCustomer;
    
    public UserRegistered(User aggregate) {
        super(aggregate);
    }

    public UserRegistered() {
        super();
    }
}
//>>> DDD / Domain Event
