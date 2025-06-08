package com.auth.demo.config;
import org.springframework.http.HttpMethod;  // Add this import

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.auth.demo.repository.UserRepository;
import com.auth.demo.security.JwtFilter;
import com.auth.demo.security.JwtUtils;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtils jwtUtil, UserRepository userRepository) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Disable CSRF
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS configuration
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tours").permitAll() // Only allow GET /api/tours
                        .requestMatchers(HttpMethod.GET, "/api/tours/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/visitors/track").permitAll()

                // Protected endpoints
                .requestMatchers("/api/tours/**").authenticated() // All other tour endpoints require auth
                .requestMatchers("/api/**").authenticated() // All other API endpoints
                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(new JwtFilter(jwtUtil, userRepository), UsernamePasswordAuthenticationFilter.class);
    
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173","http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}