package com.auth.demo.services;

import com.auth.demo.models.User;
import com.auth.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // Create a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Update an existing user
    public User updateUser(String id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        user.setRoles(userDetails.getRoles());
        return userRepository.save(user);
    }

    // Delete a user
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // Check if a user exists by email
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Find a user by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}