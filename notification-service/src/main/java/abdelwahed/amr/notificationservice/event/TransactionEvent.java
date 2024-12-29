package abdelwahed.amr.notificationservice.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TransactionEvent {
	private String id;
    private String accountNumber;
    private BigDecimal amount;
    private String type;
    private LocalDateTime dateTime;
    private String userEmail;
}
