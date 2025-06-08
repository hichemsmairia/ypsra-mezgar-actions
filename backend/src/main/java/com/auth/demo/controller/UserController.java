package com.auth.demo.controller;

import com.auth.demo.models.User;
import com.auth.demo.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
@Tag(name = "Utilisateurs", description = "API pour gérer les utilisateurs")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Récupérer tous les utilisateurs (sauf admin)", description = "Renvoie une liste de tous les utilisateurs enregistrés sauf les administrateurs.")
    @ApiResponse(responseCode = "200", description = "Liste des utilisateurs récupérée avec succès")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers()
                .stream()
                .filter(user -> !user.getRoles().contains("ADMIN"))
                .collect(Collectors.toList());
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @Operation(summary = "Récupérer un utilisateur par ID", description = "Renvoie les détails d'un utilisateur spécifique par son ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Utilisateur trouvé"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Créer un nouvel utilisateur", description = "Ajoute un nouvel utilisateur à la base de données.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Utilisateur créé avec succès"),
            @ApiResponse(responseCode = "409", description = "Conflit - L'email existe déjà")
    })
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userService.existsByEmail(user.getEmail())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @Operation(summary = "Mettre à jour un utilisateur", description = "Met à jour les informations d'un utilisateur existant.")
    @ApiResponse(responseCode = "200", description = "Utilisateur mis à jour avec succès")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @Operation(summary = "Supprimer un utilisateur", description = "Supprime un utilisateur en fonction de son ID.")
    @ApiResponse(responseCode = "204", description = "Utilisateur supprimé avec succès")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Trouver un utilisateur par email", description = "Recherche un utilisateur à partir de son email.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Utilisateur trouvé"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user-types-count")
    @Operation(summary = "Récupérer le nombre d'utilisateurs par type", description = "Renvoie le nombre d'utilisateurs de type 'owner' et 'utilisateur normal'.")
    public ResponseEntity<Map<String, Long>> getUserTypeCounts() {
        List<User> allUsers = userService.getAllUsers();
        long ownerCount = allUsers.stream().filter(user -> user.getRoles().contains("owner")).count();
        long adminCount = allUsers.stream().filter(user -> user.getRoles().contains("ADMIN") && !user.getRoles().contains("OWNER")).count();
        Map<String, Long> counts = new HashMap<>();
        counts.put("owner", ownerCount);
        counts.put("admin", adminCount);
        return new ResponseEntity<>(counts, HttpStatus.OK);
    }

    @GetMapping("/monthly-registrations")
    @Operation(summary = "Récupérer le nombre d'inscriptions par mois (sans admin)", description = "Renvoie le nombre d'utilisateurs (non admin) ayant créé un compte chaque mois avec le nom du mois (abrégé).")
    public ResponseEntity<Map<String, Object>> getMonthlyRegistrations() {
        List<User> allUsers = userService.getAllUsers();
        Map<Month, Long> monthlyCounts = allUsers.stream()
                .filter(user -> user.getTimeStamp() != null && !user.getRoles().contains("ADMIN")) // Filtrer pour exclure les admins
                .collect(Collectors.groupingBy(
                        user -> user.getTimeStamp().getMonth(),
                        Collectors.counting()
                ));

        List<String> months = new ArrayList<>();
        List<Long> userCounts = new ArrayList<>();

        for (int i = 1; i <= 12; i++) {
            Month month = Month.of(i);
            months.add(month.getDisplayName(java.time.format.TextStyle.SHORT, Locale.FRANCE)); // Obtient l'abréviation du mois en français
            userCounts.add(monthlyCounts.getOrDefault(month, 0L));
        }

        Map<String, Object> response = Map.of("months", months, "userCounts", userCounts);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/monthly-user-only-registrations")
    @Operation(summary = "Récupérer le nombre d'inscriptions par mois (seulement les utilisateurs simples)", description = "Renvoie le nombre d'utilisateurs ayant le rôle 'USER' (excluant 'ADMIN' et 'OWNER') ayant créé un compte chaque mois avec le nom du mois (abrégé).")
    public ResponseEntity<Map<String, Object>> getMonthlyUserOnlyRegistrations() {
        List<User> allUsers = userService.getAllUsers();
        Map<Month, Long> monthlyCounts = allUsers.stream()
                .filter(user -> user.getTimeStamp() != null &&
                                user.getRoles().contains("USER") && // Inclure seulement les utilisateurs avec le rôle "USER"
                                !user.getRoles().contains("ADMIN") && // Exclure les admins
                                !user.getRoles().contains("OWNER"))  // Exclure les owners
                .collect(Collectors.groupingBy(
                        user -> user.getTimeStamp().getMonth(),
                        Collectors.counting()
                ));

        List<String> months = new ArrayList<>();
        List<Long> userCounts = new ArrayList<>();

        for (int i = 1; i <= 12; i++) {
            Month month = Month.of(i);
            months.add(month.getDisplayName(java.time.format.TextStyle.SHORT, Locale.FRANCE));
            userCounts.add(monthlyCounts.getOrDefault(month, 0L));
        }

        Map<String, Object> response = Map.of("months", months, "userCounts", userCounts);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
}