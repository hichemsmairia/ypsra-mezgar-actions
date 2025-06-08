package com.auth.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String UPLOAD_DIR = "uploads/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configuration pour servir les fichiers statiques uploadés
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + UPLOAD_DIR)
                .setCachePeriod(3600)
                .resourceChain(true);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // Autoriser votre frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Content-Disposition") // Important pour les téléchargements
                .allowCredentials(true)
                .maxAge(3600);
    }
}