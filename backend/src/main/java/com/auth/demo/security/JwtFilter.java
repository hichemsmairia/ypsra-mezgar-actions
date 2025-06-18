// package com.auth.demo.security;

// import com.auth.demo.models.User;
// import com.auth.demo.repository.UserRepository;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;
// import java.util.Collections;
// import java.util.Optional;

// public class JwtFilter extends OncePerRequestFilter {

//     private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

//     private final JwtUtils jwtUtil;
//     private final UserRepository userRepository;

//     // Constructor injection for dependencies
//     public JwtFilter(JwtUtils jwtUtil, UserRepository userRepository) {
//         this.jwtUtil = jwtUtil;
//         this.userRepository = userRepository;
//     }

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//                                     HttpServletResponse response,
//                                     FilterChain filterChain) throws ServletException, IOException {
//         try {
//             String authHeader = request.getHeader("Authorization");

//             if (authHeader != null && authHeader.startsWith("Bearer ")) {
//                 String token = authHeader.substring(7);
//                 String email = jwtUtil.validateToken(token);

//                 if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                     Optional<User> userOptional = userRepository.findByEmail(email);

//                     if (userOptional.isPresent()) {
//                         User user = userOptional.get();

//                         // Create UserDetails with roles/authorities
//                         UserDetails userDetails = org.springframework.security.core.userdetails.User
//                                 .withUsername(user.getEmail())
//                                 .password(user.getPassword())
//                                 //.authorities(Collections.emptyList()) // Add roles/authorities here if needed
//                                 .build();

//                         UsernamePasswordAuthenticationToken authentication =
//                                 new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

//                         authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

//                         SecurityContextHolder.getContext().setAuthentication(authentication);
//                     } else {
//                         logger.error("User not found with email: {}", email);
//                         response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
//                         return;
//                     }
//                 }
//             }
//         } catch (Exception e) {
//             logger.error("Error processing JWT token: {}", e.getMessage());
//             response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
//             return;
//         }

//         filterChain.doFilter(request, response);
//     }
// }



package com.auth.demo.security;

import com.auth.demo.models.User;
import com.auth.demo.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component; 
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);
    private final JwtUtils jwtUtil;
    private final UserRepository userRepository;

    public JwtFilter(JwtUtils jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtil.validateToken(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    Optional<User> userOptional = userRepository.findByEmail(email);

                    if (userOptional.isPresent()) {
                        User user = userOptional.get();

                        // Convert user roles to GrantedAuthority
                        Set<GrantedAuthority> authorities = user.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                                .collect(Collectors.toSet());

                        UserDetails userDetails = org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .authorities(authorities)
                                .build();

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
            return;
        }

        filterChain.doFilter(request, response);
    }
}