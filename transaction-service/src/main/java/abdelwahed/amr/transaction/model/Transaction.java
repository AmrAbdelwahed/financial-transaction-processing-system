package abdelwahed.amr.transaction.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String accountNumber;
    private double amount;
    private String type; // DEBIT, CREDIT
    private String date;
}
