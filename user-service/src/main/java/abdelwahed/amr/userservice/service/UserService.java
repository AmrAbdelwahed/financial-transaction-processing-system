package abdelwahed.amr.userservice.service;


import  abdelwahed.amr.userservice.model.User;
import  abdelwahed.amr.userservice.repository.UserRepository;
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

    public User createUser(User user) {
    	try {
            System.out.println("Creating user: " + user);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            System.out.println("User saved: " + savedUser);
            kafkaTemplate.send("users", savedUser.getId(), savedUser.toString());
            return savedUser;
        }
    	catch (Exception e) {
            System.err.println("Error in createUser: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}


