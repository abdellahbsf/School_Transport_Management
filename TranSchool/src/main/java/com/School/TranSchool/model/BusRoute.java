package com.School.TranSchool.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class BusRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String startLocation;
    private String endLocation;

    @OneToMany
    private List<Location> stops = new ArrayList<>(); // Change from List<String> to List<Location>

    @OneToMany
    private List<Student> assignedStudents;

    // Method to collect all pickup locations from assigned students
    public List<Location> getPickupLocations() {
        List<Location> pickupLocations = new ArrayList<>();
        for (Student student : assignedStudents) {
            if (student.getPickupLocation() != null) {
                pickupLocations.add(student.getPickupLocation());
            }
        }
        return pickupLocations;
    }

    // Method to update stops based on pickup locations
    public void updateStops() {
        this.stops = getPickupLocations();
    }

    // Method to assign a student and update stops
    public void addStudentLocationToStops(Student student) {
        assignedStudents.add(student);
        updateStops(); // Update stops whenever a student is added
    }

    // Additional methods can be added as needed
}
