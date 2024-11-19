package com.School.TranSchool.repository;

import com.School.TranSchool.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
    User findByUsername(String username);

    boolean existsByUsername(String username);
}
