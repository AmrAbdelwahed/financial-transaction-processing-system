package abdelwahed.amr.notificationservice.event;

import lombok.Data;

@Data
public class UserEvent {
	private String id;
    private String username;
    private String email;

}
