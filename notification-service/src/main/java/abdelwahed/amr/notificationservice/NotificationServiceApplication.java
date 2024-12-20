package abdelwahed.amr.notificationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }

    @Component
    public class NotificationListener {

        @KafkaListener(topics = "transactions", groupId = "notification-group")
        public void listen(String message) {
            System.out.println("Received transaction: " + message);
            // Add notification logic here
        }

        @KafkaListener(topics = "users", groupId = "notification-group")
        public void listenUser(String message) {
            System.out.println("Received user: " + message);
            // Add notification logic here
        }
    }
}
