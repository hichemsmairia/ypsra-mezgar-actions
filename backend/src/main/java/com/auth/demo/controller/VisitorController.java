 package com.auth.demo.controller;

import org.springframework.web.bind.annotation.*;

import com.auth.demo.dtos.TrackVisitorRequest;
import com.auth.demo.dtos.PositionVisitCount;
import com.auth.demo.dtos.Position;
import com.auth.demo.repository.VisitorRepository;
import com.auth.demo.services.VisitorService;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/visitors") //   
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VisitorController {

    private final VisitorService visitorService;
    private final VisitorRepository visitorRepository;

    public VisitorController(VisitorService visitorService, VisitorRepository visitorRepository) {
        this.visitorService = visitorService;
        this.visitorRepository = visitorRepository;  
    }

    @PostMapping("/track")
    public void trackVisitor(@RequestBody TrackVisitorRequest requestBody) {
        Position position = requestBody.getPosition();
        String tourId = requestBody.getTourId();

        visitorService.trackVisitor(position, tourId);
    }

    // Renamed endpoint to better reflect position-based grouping
    @GetMapping("/positions")
    public List<PositionVisitCount> getVisitCountsByPosition() {
        return visitorRepository.countVisitsByApproxPosition();
    }
    
    @GetMapping("/monthly")
    public Map<String, int[]> getMonthlyVisitsPerTour() {
        return visitorService.getVisitsPerTourPerMonth();
    }

}
