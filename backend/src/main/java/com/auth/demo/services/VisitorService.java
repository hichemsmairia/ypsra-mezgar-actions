package com.auth.demo.services;

import org.springframework.stereotype.Service;

import com.auth.demo.models.Visitor;
import com.auth.demo.repository.VisitorRepository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.auth.demo.dtos.Position;

@Service
public class VisitorService {

    private final VisitorRepository visitorRepository;

    public VisitorService(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }

    public void trackVisitor(Position position, String tourId) {
        try {
            Visitor visitor = new Visitor();
            visitor.setTourId(tourId);
            visitor.setVisitedAt(LocalDateTime.now());
            visitor.setPosition(position); // Set the provided lat/lng position
            visitorRepository.save(visitor);
        } catch (Exception e) {
            System.out.println("Error saving visitor: " + e.getMessage());
        }
    }
    public Map<String, int[]> getVisitsPerTourPerMonth() {
        List<Visitor> visitors = visitorRepository.findAll();
        Map<String, int[]> result = new HashMap<>();

        for (Visitor visitor : visitors) {
            String tourId = visitor.getTourId();
            LocalDateTime visitedAt = visitor.getVisitedAt();

            if (visitedAt != null) {
                ZonedDateTime dateTime = visitedAt.atZone(ZoneId.of("UTC"));
                int month = dateTime.getMonthValue() - 1; // 0-based index for months

                result.computeIfAbsent(tourId, k -> new int[12]);
                result.get(tourId)[month]++;
            }
        }

        return result;
    }
}
