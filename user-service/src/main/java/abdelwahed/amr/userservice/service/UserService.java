package abdelwahed.amr.userservice.service;

import abdelwahed.amr.userservice.model.User;
import abdelwahed.amr.userservice.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson ObjectMapper

    public User createUser(User user) {
        try {
            // Encode password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Save the user to the database
            User savedUser = userRepository.save(user);

            // Serialize the user object to a JSON string
            String userJson = objectMapper.writeValueAsString(savedUser);

            // Send the serialized user data to Kafka with user ID as the key
            kafkaTemplate.send("users", savedUser.getId(), userJson);

            return savedUser;
        } catch (JsonProcessingException e) {
            // Handle JSON processing error
            e.printStackTrace();
            throw new RuntimeException("Error serializing user to JSON", e);
        } catch (Exception e) {
            // Handle other exceptions
            e.printStackTrace();
            throw new RuntimeException("Error creating user", e);
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
