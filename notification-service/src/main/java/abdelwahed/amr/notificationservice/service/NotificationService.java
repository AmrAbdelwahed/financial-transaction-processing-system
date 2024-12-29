package abdelwahed.amr.notificationservice.service;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import abdelwahed.amr.notificationservice.event.TransactionEvent;
import abdelwahed.amr.notificationservice.event.UserEvent;

@Service	
public class NotificationService {
	
	private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final ObjectMapper objectMapper;
    private final JavaMailSender emailSender;

    @Autowired
    public NotificationService(ObjectMapper objectMapper, JavaMailSender emailSender) {
        this.objectMapper = objectMapper;
        this.emailSender = emailSender;
        logger.info("NotificationService initialized with emailSender: {}", emailSender);

    }
    
    @KafkaListener(topics = "users", groupId = "notification-group")
    public void handleUser(String message) {
        logger.info("Received user: {}", message);
        
        try {
            // Assuming UserEvent is parsed from the message
            UserEvent userEvent = objectMapper.readValue(message, UserEvent.class);
            sendWelcomeEmail(userEvent);
        } catch (Exception e) {
            logger.error("Failed to send welcome email", e);
        }
    }

    @KafkaListener(topics = "transactions", groupId = "notification-group")
    public void handleTransaction(String message) {
        logger.info("Received transaction: {}", message);
        
        try {
            TransactionEvent transactionEvent = objectMapper.readValue(message, TransactionEvent.class);
            // Trigger debit notification
            if ("DEBIT".equals(transactionEvent.getType())) {
                sendDebitNotification(transactionEvent);
            }
            // Trigger credit notification
            if ("CREDIT".equals(transactionEvent.getType())) {
                sendCreditNotification(transactionEvent);
            }
            // Trigger high-value transaction alert if applicable
            if (transactionEvent.getAmount().compareTo(new BigDecimal("1000")) > 0) {
                sendHighValueTransactionAlert(transactionEvent);
            }
        } catch (Exception e) {
            logger.error("Failed to process transaction", e);
        }
    }

    private void sendHighValueTransactionAlert(TransactionEvent transaction) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("security@streamlinepay.com");
        message.setTo(transaction.getUserEmail());
        message.setTo("amrabdelwahed00@gmail.com");
        message.setSubject("High Value Transaction Alert");
        message.setText(String.format(
            "High value transaction detected:\nAmount: $%s\nAccount: %s\nType: %s\nTime: %s",
            transaction.getAmount(),
            transaction.getAccountNumber(),
            transaction.getType(),
            transaction.getDate()
        ));
        
        try {
            emailSender.send(message);
            logger.info("High value transaction alert sent for transaction: {}", transaction.getId());
        } catch (Exception e) {
            logger.error("Failed to send high value transaction alert", e);
        }
    }

    private void sendDebitNotification(TransactionEvent transaction) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(transaction.getUserEmail());
        message.setTo("amrabdelwahed00@gmail.com");
        message.setSubject("Debit Transaction Notification");
        message.setText(String.format(
            "A debit of $%s has been processed on your account %s",
            transaction.getAmount(),
            transaction.getAccountNumber()
        ));
        
        try {
            emailSender.send(message);
            logger.info("Debit notification sent for transaction: {}", transaction.getId());
        } catch (Exception e) {
            logger.error("Failed to send debit notification", e);
        }
    }

    private void sendCreditNotification(TransactionEvent transaction) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(transaction.getUserEmail());
        message.setTo("amrabdelwahed00@gmail.com");
        message.setSubject("Credit Transaction Notification");
        message.setText(String.format(
            "A credit of $%s has been processed to your account %s",
            transaction.getAmount(),
            transaction.getAccountNumber()
        ));
        
        try {
            emailSender.send(message);
            logger.info("Credit notification sent for transaction: {}", transaction.getId());
        } catch (Exception e) {
            logger.error("Failed to send credit notification", e);
        }
    }

    private void sendWelcomeEmail(UserEvent user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Welcome to StreamlinePay!");
        message.setText(String.format(
            "Dear %s,\n\nWelcome to StreamlinePay! Your account has been successfully created.",
            user.getUsername()
        ));
        
        try {
            emailSender.send(message);
            logger.info("Welcome email sent to user: {}", user.getUsername());
        } catch (Exception e) {
            logger.error("Failed to send welcome email", e);
        }
    }

}
