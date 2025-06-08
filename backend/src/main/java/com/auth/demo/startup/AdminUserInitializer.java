package com.auth.demo.startup;

import com.auth.demo.models.User;
import com.auth.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public AdminUserInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@gmail.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            User adminUser = new User();
            adminUser.setEmail(adminEmail);
            adminUser.setUsername("admin");
            adminUser.setPassword(encoder.encode("admin"));
            adminUser.setRoles(Set.of("ADMIN"));

            userRepository.save(adminUser);
            System.out.println("✅ Admin user created!");
        } else {
            System.out.println("ℹ️ Admin user already exists.");
        }
    }
}
