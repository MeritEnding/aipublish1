package aipublish.domain;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "book_purchase_log")
@Data
public class BookPurchaseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long userId;
    private Long bookId;

    private Date purchasedAt = new Date();
}
