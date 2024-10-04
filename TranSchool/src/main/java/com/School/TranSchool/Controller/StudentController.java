package com.School.TranSchool.Controller;

import com.School.TranSchool.model.Location;
import com.School.TranSchool.model.Student;
import com.School.TranSchool.model.User;
import com.School.TranSchool.service.LocationService;
import com.School.TranSchool.service.StudentService;
import com.School.TranSchool.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService studentService;

    @Autowired
    private final UserService userService;
    @Autowired
    private final LocationService locationService;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        logger.info("Received request to create student: {}", student);

        // Ensure pickup location is provided
        if (student.getPickupLocation() == null) {
            logger.error("Pickup location is null for student: {}", student);
            throw new RuntimeException("Pickup location must be provided for creating a student.");
        }

        // Create the user for the student
        User user = new User();
        user.setUsername(student.getUsername());
        user.setPassword(student.getPassword());
        user.setRole("ROLE_STUDENT");

        try {
            userService.createUser(user);
            student.setUser(user);
            logger.info("User created for student: {}", user);
        } catch (Exception e) {
            logger.error("Failed to create user for student {}: {}", student.getName(), e.getMessage(), e);
            throw new RuntimeException("Failed to create user for student.");
        }

        // Check for existing location
        logger.info("Checking for existing location for coordinates: latitude={}, longitude={}",
                student.getPickupLocation().getLatitude(), student.getPickupLocation().getLongitude());

        Optional<Location> existingLocation = locationService.findByCoordinates(
                student.getPickupLocation().getLatitude(),
                student.getPickupLocation().getLongitude()
        );

        if (existingLocation.isPresent()) {
            // If location exists, set it to the student
            student.setPickupLocation(existingLocation.get());
            logger.info("Existing location found for student {}: {}", student.getName(), existingLocation.get());
        } else {
            // If it doesn't exist, save the new location
            Location newLocation = new Location();
            newLocation.setLatitude(student.getPickupLocation().getLatitude());
            newLocation.setLongitude(student.getPickupLocation().getLongitude());

            try {
                Location savedLocation = locationService.save(newLocation);
                student.setPickupLocation(savedLocation); // Link the saved location to the student
                logger.info("New location created and linked to student {}: {}", student.getName(), savedLocation);
            } catch (Exception e) {
                logger.error("Failed to save new location for student {}: {}", student.getName(), e.getMessage(), e);
                throw new RuntimeException("Failed to save new location.");
            }
        }

        // Save the student details
        try {
            Student savedStudent = studentService.addStudent(student); // Ensure this method is correctly implemented to save the student
            logger.info("Student created successfully: {}", savedStudent);
            return ResponseEntity.ok(savedStudent);
        } catch (Exception e) {
            logger.error("Failed to save student {}: {}", student.getName(), e.getMessage(), e);
            throw new RuntimeException("Failed to save student.");
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.findById(id);
        if (student != null) {
            return ResponseEntity.ok(student);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // Other APIs for updating, deleting students
}

