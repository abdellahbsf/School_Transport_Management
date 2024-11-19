package com.School.TranSchool.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_user") // Use a different table name
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // Unique username for login

    @Column(nullable = false, unique = true)
    private String email; // Unique username for login

    @Column(nullable = false)
    private String password; // Hashed password for security

    @Column(nullable = false)
    private String role; // User role (e.g., ROLE_STUDENT, ROLE_ADMIN)
}
