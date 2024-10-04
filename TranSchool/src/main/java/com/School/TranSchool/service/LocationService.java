package com.School.TranSchool.service;
import com.School.TranSchool.model.Location;
import com.School.TranSchool.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository; // Assume you have a LocationRepository for database operations

    public Location save(Location location) {
        return locationRepository.save(location);
    }

    public Optional<Location> findByCoordinates(Double latitude, Double longitude) {
        return locationRepository.findByLatitudeAndLongitude(latitude, longitude);
    }

    public Optional<Location> findById(Long id) {
        return locationRepository.findById(id);
    }
}

