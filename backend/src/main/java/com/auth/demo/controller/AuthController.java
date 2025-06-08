package com.auth.demo.controller;

import com.auth.demo.dtos.AuthRequest;
import com.auth.demo.dtos.AuthResponse;
import com.auth.demo.dtos.RegisterRequest;
import com.auth.demo.dtos.UpdateRequest;

import com.auth.demo.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth") // Changé de "/auth" à "/api/auth" pour correspondre à votre frontend
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@Tag(name = "Authentication", description = "Endpoints pour l'authentification des utilisateurs")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Enregistrer un nouvel utilisateur", 
               description = "Cette méthode permet d'enregistrer un nouvel utilisateur avec un email, un nom d'utilisateur, un mot de passe et un rôle")
    public ResponseEntity<Map<String, String>> register(@ModelAttribute RegisterRequest request) {
        return authService.register(request);
    }
    

    @PostMapping("/login")
    @Operation(summary = "Connexion de l'utilisateur", 
               description = "Cette méthode permet de connecter un utilisateur avec son email et son mot de passe")
    public AuthResponse login(
        @RequestBody @Parameter(description = "Détails de la demande de connexion de l'utilisateur") AuthRequest request) {
        return authService.login(request);
    }
    @PutMapping("/update_user")
    public ResponseEntity<Map<String, Object>> updateUser(
            
            @ModelAttribute UpdateRequest request
    ) {
        return authService.update( request);
    }
}
