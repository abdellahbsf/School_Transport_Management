package com.School.TranSchool.Controller;

import com.School.TranSchool.exception.AuthenticationException;
import com.School.TranSchool.exception.UsernameAlreadyExistsException;
import com.School.TranSchool.model.User;
import com.School.TranSchool.repository.UserRepository;
import com.School.TranSchool.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    private final UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String SECRET_KEY = "9042af16688ef5a571de80e25c69b9c8d887c6eb8489b447f7529514d2d0b9040dfc43d45348e95b816b30bbe8e798ff442accf2d30e42ebb2fd9dd7ec108bbd"; // Use a strong secret key

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        User foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser == null || !passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            log.warn("Failed login attempt for username: {}", user.getUsername());
            throw new AuthenticationException("Invalid username or password");
        }

        String token = generateToken(foundUser);
        Date expirationDate = new Date(System.currentTimeMillis() + 86400000); // 1 day expiration

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("expiresAt", expirationDate);

        log.info("User '{}' logged in successfully", user.getUsername());
        return ResponseEntity.ok(response);
    }

    private String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole()) // Include user role in token
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiration
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        // Validate if the username already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        // Validate if the email already exists (optional)
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UsernameAlreadyExistsException("Email already exists");
        }

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        // Save user to the database
        userRepository.save(user);

        // Return success response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
