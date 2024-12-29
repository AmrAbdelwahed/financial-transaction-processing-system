package abdelwahed.amr.transaction.service;

import abdelwahed.amr.transaction.model.Transaction;
import abdelwahed.amr.transaction.repository.TransactionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson ObjectMapper

    public Transaction createTransaction(Transaction transaction) {
        // Save the transaction to the database
        Transaction savedTransaction = transactionRepository.save(transaction);

        try {
            // Convert the transaction object into a JSON string
            String transactionJson = objectMapper.writeValueAsString(transaction);

            // Send the JSON payload to Kafka with the transaction ID as the key
            kafkaTemplate.send("transactions", transaction.getId(), transactionJson);
        } catch (JsonProcessingException e) {
            // Handle JSON processing error
            e.printStackTrace();
        }

        return savedTransaction;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
