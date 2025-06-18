// package com.auth.demo.services;

// import com.auth.demo.dtos.AuthRequest;
// import com.auth.demo.dtos.AuthResponse;
// import com.auth.demo.dtos.RegisterRequest;
// import com.auth.demo.dtos.UpdateRequest;
// import com.auth.demo.models.User;
// import com.auth.demo.repository.UserRepository;
// import com.auth.demo.security.JwtUtils;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.*;
// import org.springframework.http.ResponseEntity;
// import org.springframework.http.HttpStatus;
// import org.springframework.mock.web.MockMultipartFile;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// import java.util.*;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

// public class AuthServiceTest {

//     @InjectMocks
//     private AuthService authService;

//     @Mock
//     private UserRepository userRepository;

//     @Mock
//     private FileStorageService fileStorageService;

//     @Mock
//     private JwtUtils jwtUtil;

//     @BeforeEach
//     void setup() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void testRegisterUserAlreadyExists() {
//         RegisterRequest request = new RegisterRequest();
//         request.setEmail("test@example.com");

//         when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

//         ResponseEntity<Map<String, String>> response = authService.register(request);
//         assertEquals(HttpStatus.CREATED, response.getStatusCode());
//         assertEquals("Email deja utilisé", response.getBody().get("error"));
//     }

//     @Test
//     void testRegisterSuccess() {
//         RegisterRequest request = new RegisterRequest();
//         request.setEmail("test@example.com");
//         request.setUsername("testUser");
//         request.setPassword("password123");
//       request.setRoles(Collections.singleton("ROLE_USER")); 
//         request.setImage(new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes()));

//         when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
//         when(fileStorageService.store(any())).thenReturn("test.jpg");

//         ResponseEntity<Map<String, String>> response = authService.register(request);
//         assertEquals(HttpStatus.CREATED, response.getStatusCode());
//         assertEquals("compte creer avec succes ! ", response.getBody().get("msg"));
//     }

//     @Test
//     void testLoginSuccess() {
//         String password = "password123";
//         User user = new User();
//         user.setEmail("test@example.com");
//         user.setPassword(new BCryptPasswordEncoder().encode(password));

//         AuthRequest request = new AuthRequest("test@example.com", password);

//         when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
//         when(jwtUtil.generateToken("test@example.com")).thenReturn("fake-jwt-token");

//         AuthResponse response = authService.login(request);
//         assertEquals("Login successful", response.getMessage());
//         assertEquals("fake-jwt-token", response.getToken());
//     }

//     @Test
//     void testLoginWrongPassword() {
//         User user = new User();
//         user.setEmail("test@example.com");
//         user.setPassword(new BCryptPasswordEncoder().encode("correctPassword"));

//         AuthRequest request = new AuthRequest("test@example.com", "wrongPassword");

//         when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

//         AuthResponse response = authService.login(request);
//         assertNull(response.getToken());
//         assertEquals("mot de passe incorrecte", response.getError());
//     }

//     @Test
//     void testLoginUserNotFound() {
//         AuthRequest request = new AuthRequest("notfound@example.com", "password");

//         when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

//         AuthResponse response = authService.login(request);
//         assertEquals("email non trouvé", response.getError());
//     }

//     @Test
//     void testUpdateUserNotFound() {
//         UpdateRequest request = new UpdateRequest();
//         request.setEmail("unknown@example.com");

//         when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

//         ResponseEntity<Map<String, Object>> response = authService.update(request);
//         assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
//         assertEquals("User not found!", response.getBody().get("message"));
//     }

//     @Test
//     void testUpdateUserSuccess() {
//         User user = new User();
//         user.setEmail("existing@example.com");
//         user.setUsername("oldName");

//         UpdateRequest request = new UpdateRequest();
//         request.setEmail("existing@example.com");
//         request.setUsername("newName");

//         when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(user));

//         ResponseEntity<Map<String, Object>> response = authService.update(request);
//         assertEquals(HttpStatus.OK, response.getStatusCode());
//         assertEquals("newName", ((User) response.getBody().get("user")).getUsername());
//     }
// }

