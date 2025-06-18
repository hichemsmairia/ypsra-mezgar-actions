// package com.auth.demo.services;

// import com.auth.demo.dtos.AuthRequest;
// import com.auth.demo.dtos.AuthResponse;
// import com.auth.demo.dtos.RegisterRequest;
// import com.auth.demo.dtos.UpdateRequest;
// import com.auth.demo.models.User;
// import com.auth.demo.repository.UserRepository;
// import com.auth.demo.security.JwtUtils;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;

// import java.util.Collections;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.Optional;

// @Service
// public class AuthService {
//     @Autowired
//     private UserRepository userRepository;
//     @Autowired
//     private FileStorageService fileStorageService;
//     @Autowired
//     private JwtUtils jwtUtil;

//     private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

//     public ResponseEntity<Map<String, String>> register(RegisterRequest request) {
//         Map<String, String> response = new HashMap<>();
    
//         if (userRepository.existsByEmail(request.getEmail())) {
//             response.put("error", "Email deja utilisé");
//             response.put("Status", HttpStatus.CONFLICT.toString());
//             return new ResponseEntity<>(response,HttpStatus.CREATED);
//         }
    
//         String imageUrl = "default.jpg"; // Default image URL or path
//         if (request.getImage() != null && !request.getImage().isEmpty()) {
//             imageUrl = fileStorageService.store(request.getImage());
//         }
    
//         User user = new User();
//         user.setUsername(request.getUsername());
//         user.setEmail(request.getEmail());
        
//         user.setPassword(passwordEncoder.encode(request.getPassword()));
//         user.setRoles(request.getRoles());
//         user.setImage(imageUrl); // Set image URL or path
    
//         userRepository.save(user);    
    
//         response.put("msg", "compte creer avec succes ! ");
//         response.put("Status", HttpStatus.CREATED.toString());
//         response.put("user_id", user.getId());
//         return new ResponseEntity<>(response, HttpStatus.CREATED);
//     }

//     public AuthResponse login(AuthRequest request) {
//         Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
//         if (userOptional.isPresent()) {
//             User user = userOptional.get();
//             if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//                 String token = jwtUtil.generateToken(user.getEmail());
//                 return new AuthResponse(token, "Login successful", null, user);
//             }
//             if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//                 return new AuthResponse(null, null, "mot de passe incorrecte", null);
//             }
//         }

        
//         return new AuthResponse(null, null, "email non trouvé", null);
        
//     }

//     public ResponseEntity<Map<String, Object>> update(UpdateRequest request) {
//         Map<String, Object> response = new HashMap<>();
    
//         Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
//         if (userOptional.isEmpty()) {
//             response.put("message", "User not found!");
//             response.put("status", HttpStatus.NOT_FOUND.toString());
//             return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//         }    
    
//         User user = userOptional.get();
       
//         // Update fields only if provided
//         if (request.getUsername() != null && !request.getUsername().isEmpty()) {
//             user.setUsername(request.getUsername());
//         }
    
//         if (request.getEmail() != null && !request.getEmail().isEmpty()) {
//             user.setEmail(request.getEmail());
//         }
    
//         if (request.getRoles() != null && !request.getRoles().isEmpty()) {
//             user.setRoles(request.getRoles());
//         }
    
//         if (request.getPassword() != null && !request.getPassword().isEmpty()) {
//             user.setPassword(passwordEncoder.encode(request.getPassword()));
//         }
    
//         if (request.getImage() != null && !request.getImage().isEmpty()) {
//             String imageFilename = fileStorageService.store(request.getImage());
//             user.setImage(imageFilename);
//         }
    
//         userRepository.save(user);
    
//         response.put("message", "User updated successfully!");
//         response.put("user", user);  // Now allowed since the Map accepts Object values
//         response.put("status", HttpStatus.OK.toString());
//         return new ResponseEntity<>(response, HttpStatus.OK);
//     }
    


// }


package com.auth.demo.services;

import com.auth.demo.dtos.AuthRequest;
import com.auth.demo.dtos.AuthResponse;
import com.auth.demo.dtos.RegisterRequest;
import com.auth.demo.dtos.UpdateRequest;
import com.auth.demo.models.User;
import com.auth.demo.repository.UserRepository;
import com.auth.demo.security.JwtUtils;
import com.auth.demo.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private JwtUtils jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<Map<String, String>> register(RegisterRequest request) {
        Map<String, String> response = new HashMap<>();
    
        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("error", "Email deja utilisé");
            response.put("Status", HttpStatus.CONFLICT.toString());
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
    
        String imageUrl = "default.jpg";
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = fileStorageService.store(request.getImage());
        }
    
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Set default role if none provided
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            user.setRoles(Set.of("USER"));
        } else {
            user.setRoles(request.getRoles());
        }
        
        user.setImage(imageUrl);
        userRepository.save(user);    
    
        response.put("msg", "compte creer avec succes ! ");
        response.put("Status", HttpStatus.CREATED.toString());
        response.put("user_id", user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

public AuthResponse login(AuthRequest request) {
    try {
        // First verify user exists
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, "email non trouvé", null);
        }
        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(null, null, "mot de passe incorrecte", null);
        }
        
        // Then attempt authentication
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, "Login successful", null, userOptional.get());
        
    } catch (BadCredentialsException e) {
        return new AuthResponse(null, null, "mot de passe incorrecte", null);
    } catch (Exception e) {
        //logger.error("Login error: {}", e.getMessage());
        return new AuthResponse(null, null, e.getMessage(), null);
    }
}

    public ResponseEntity<Map<String, Object>> update(UpdateRequest request) {
        Map<String, Object> response = new HashMap<>();
    
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            response.put("message", "User not found!");
            response.put("status", HttpStatus.NOT_FOUND.toString());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }    
    
        User user = userOptional.get();
       
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            user.setUsername(request.getUsername());
        }
    
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
    
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            user.setRoles(request.getRoles());
        }
    
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
    
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageFilename = fileStorageService.store(request.getImage());
            user.setImage(imageFilename);
        }
    
        userRepository.save(user);
    
        response.put("message", "User updated successfully!");
        response.put("user", user);
        response.put("status", HttpStatus.OK.toString());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
