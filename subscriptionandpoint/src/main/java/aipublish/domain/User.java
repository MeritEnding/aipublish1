package aipublish.domain;

import aipublish.SubscriptionandpointApplication;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "User_table")
@Data
//<<< DDD / Aggregate Root
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String email;

    private String passwordHash;

    private Boolean isKtCustomer;

    private Boolean subscription;

    @JsonProperty("isAdmin")
    private Boolean isAdmin;

    public static UserRepository repository() {
        UserRepository userRepository = SubscriptionandpointApplication.applicationContext.getBean(
            UserRepository.class
        );
        return userRepository;
    }

    //<<< Clean Arch / Port Method
    public void registerUser(RegisterUserCommand registerUserCommand) {
        this.name = registerUserCommand.getName();
    this.email = registerUserCommand.getEmail();
    this.passwordHash = registerUserCommand.getPasswordHash();
    this.isKtCustomer = registerUserCommand.getIsKtCustomer();
    this.subscription = registerUserCommand.getSubscription() != null ? registerUserCommand.getSubscription() : false;
    this.isAdmin = registerUserCommand.getIsAdmin() != null ? registerUserCommand.getIsAdmin() : false;
    }

    @JsonIgnore
    public Boolean getIsAdmin() {
        return isAdmin;
    }

    @JsonIgnore
    public Boolean isAdmin() {
        return Boolean.TRUE.equals(isAdmin);
    }

    //>>> Clean Arch / Port Method
    //<<< Clean Arch / Port Method
    public void grantWelcomePoint(
        GrantWelcomePointCommand grantWelcomePointCommand
    ) {
        //implement business logic here:

    }
    //>>> Clean Arch / Port Method

}
//>>> DDD / Aggregate Root
