package com.School.TranSchool.service;

import com.School.TranSchool.model.BusRoute;
import com.School.TranSchool.repository.BusRouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusRouteService {

    @Autowired
    private BusRouteRepository busRouteRepository;

    public List<BusRoute> getAllRoutes() {
        return busRouteRepository.findAll();
    }

    public BusRoute createRoute(BusRoute busRoute) {
        return busRouteRepository.save(busRoute);
    }

    public Optional<BusRoute> getRouteById(Long id) {
        return busRouteRepository.findById(id);
    }

    public void deleteRoute(Long id) {
        busRouteRepository.deleteById(id);
    }


    public void save(BusRoute busRoute) {
        busRouteRepository.save(busRoute);
    }
}
