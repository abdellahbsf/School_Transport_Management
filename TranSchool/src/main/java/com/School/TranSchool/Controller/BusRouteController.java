package com.School.TranSchool.Controller;

import com.School.TranSchool.model.BusRoute;
import com.School.TranSchool.model.Location;
import com.School.TranSchool.model.Student;
import com.School.TranSchool.service.BusRouteService;
import com.School.TranSchool.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // To allow Angular frontend access
@RequestMapping("/api/bus-routes")
@RequiredArgsConstructor
public class BusRouteController {

    private final LocationService locationService;
    private final BusRouteService busRouteService;

    @GetMapping
    public List<BusRoute> getAllRoutes() {
        return busRouteService.getAllRoutes();
    }

    @PostMapping
    public ResponseEntity<BusRoute> createRoute(@RequestBody BusRoute busRoute) {
        // Ensure that the stops are addresses (String) before adding them to the BusRoute
        if (busRoute.getStops() != null) {
            // Set the stops directly since they are already in the required format
            // Assuming the input is validated beforehand
        }

        // Save the bus route
        BusRoute savedRoute = busRouteService.createRoute(busRoute);
        return ResponseEntity.ok(savedRoute);
    }


    @DeleteMapping("/{id}")
    public void deleteRoute(@PathVariable Long id) {
        busRouteService.deleteRoute(id);
    }

    @PostMapping("/{routeId}/students")
    public ResponseEntity<BusRoute> addStudentToRoute(@PathVariable Long routeId, @RequestBody Student student) {
        Optional<BusRoute> optionalBusRoute = busRouteService.getRouteById(routeId);

        if (optionalBusRoute.isPresent()) {
            BusRoute busRoute = optionalBusRoute.get(); // Get the BusRoute object
            busRoute.addStudentLocationToStops(student); // Ensure this method is in the BusRoute class
            busRouteService.save(busRoute); // Save the updated bus route
            return ResponseEntity.ok(busRoute); // Return the updated bus route
        }

        return ResponseEntity.notFound().build(); // Return 404 if not found
    }
}
