package com.School.TranSchool.Controller;

import com.School.TranSchool.model.User;
import com.School.TranSchool.repository.UserRepository;
import com.School.TranSchool.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String SECRET_KEY = "9042af16688ef5a571de80e25c69b9c8d887c6eb8489b447f7529514d2d0b9040dfc43d45348e95b816b30bbe8e798ff442accf2d30e42ebb2fd9dd7ec108bbd"; // Use a strong secret key

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser != null && passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            return generateToken(foundUser);
        }
        throw new RuntimeException("Invalid username or password");
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
    public ResponseEntity<String> register(@RequestBody User user) {

        userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }
}
