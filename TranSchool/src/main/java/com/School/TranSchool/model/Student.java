package com.School.TranSchool.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phoneNumber;

    @OneToOne
    @JoinColumn(name = "pickup_location_id")
    private Location pickupLocation; // Reference to the Location entity

    @Column(unique = true)
    private String username; // Add username field

    private String password; // Add password field

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user; // Link to the User class

    // Additional fields can be added as needed
}
