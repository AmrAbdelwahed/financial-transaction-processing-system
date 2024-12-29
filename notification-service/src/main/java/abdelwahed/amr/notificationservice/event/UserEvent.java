package abdelwahed.amr.notificationservice.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserEvent {
	private String id;
    private String username;
    private String email;

}
