package com.netflix.backend.controller;

import com.netflix.backend.model.User;
import com.netflix.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
// 🔥 Yahan se purana @CrossOrigin hata diya hai kyunki Global Config ab handle karega
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // --- SIGN IN ---
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody User request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            if (existingUser.getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok(existingUser);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found. Please sign up.");
        }
    }

    // --- SIGN UP ---
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already registered!");
        }

        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());

        if (request.getEmail().equalsIgnoreCase("admin@gmail.com")) {
            newUser.setRole("ADMIN");
        } else {
            newUser.setRole("USER");
        }

        userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
}