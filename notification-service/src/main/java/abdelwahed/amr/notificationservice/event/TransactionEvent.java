package abdelwahed.amr.notificationservice.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionEvent {
	private String id;
    private String accountNumber;
    private BigDecimal amount;
    private String type;
    private String date;
    private String userEmail;
}
