package abdelwahed.amr.userservice.controller;

import abdelwahed.amr.userservice.model.User;
import  abdelwahed.amr.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
    	System.out.println("POST request received: " + user);
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping
    public List<User> getAllUsers() {
        System.out.println("Received request to fetch all users");
        return userService.getAllUsers();
    }
}
