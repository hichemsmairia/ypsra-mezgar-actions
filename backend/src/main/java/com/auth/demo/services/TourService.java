package com.auth.demo.services;

import com.auth.demo.models.Plan;
import com.auth.demo.models.Scene;
import com.auth.demo.models.Tour;
import com.auth.demo.repository.PlanRepository;
import com.auth.demo.repository.SceneRepository;
import com.auth.demo.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private SceneRepository sceneRepository;

    @Autowired
    private PlanRepository planRepository;

    public List<Tour> getAllTours() {
        List<Tour> tours = tourRepository.findAll();
        tours.forEach(this::populateTourDetails);
        return tours;
    }

    public Tour getTourById(String id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));
        populateTourDetails(tour);
        return tour;
    }

    public Tour createTour(Tour tour) {
        if (tour.getSceneIds() == null) tour.setSceneIds(List.of());
        tour.setTimeStamp(LocalDateTime.now());
        return tourRepository.save(tour);
    }

    public Tour updateTour(String id, Tour updatedTour) {
        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

        existingTour.setTourName(updatedTour.getTourName());
        existingTour.setSceneIds(updatedTour.getSceneIds() != null ? updatedTour.getSceneIds() : new ArrayList<>());
        existingTour.setPlanId(updatedTour.getPlanId());
        existingTour.setLocalisation(updatedTour.getLocalisation());
        existingTour.setContactInfos(updatedTour.getContactInfos());
        Tour savedTour = tourRepository.save(existingTour);
        populateTourDetails(savedTour);
        return savedTour;
    }

    public String deleteTour(String id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

        if (tour.getSceneIds() != null && !tour.getSceneIds().isEmpty()) {
            sceneRepository.deleteAllById(tour.getSceneIds());
        }

        if (tour.getPlanId() != null) {
            planRepository.deleteById(tour.getPlanId());
        }

        tourRepository.delete(tour);
        return "Tour, associated scenes and plan deleted successfully";
    }

    public Tour addSceneToTour(String tourId, String sceneId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

        if (tour.getSceneIds() == null) {
            tour.setSceneIds(new ArrayList<>());
        }

        if (!tour.getSceneIds().contains(sceneId)) {
            tour.getSceneIds().add(sceneId);
            tourRepository.save(tour);
        }

        populateTourDetails(tour);
        return tour;
    }

    public Tour removeSceneFromTour(String tourId, String sceneId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

        if (tour.getSceneIds() != null) {
            tour.getSceneIds().remove(sceneId);
            tourRepository.save(tour);
        }

        populateTourDetails(tour);
        return tour;
    }

    public Map<String, Object> getMonthlyTourCounts() {
        List<Tour> allTours = tourRepository.findAll();
        Map<Month, Long> monthlyCounts = allTours.stream()
                .collect(Collectors.groupingBy(
                        tour -> tour.getTimeStamp().getMonth(),
                        Collectors.counting()
                ));

        List<String> months = new ArrayList<>();
        List<Long> tourCounts = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            Month month = Month.of(i);
            months.add(month.toString().substring(0, 3));
            tourCounts.add(monthlyCounts.getOrDefault(month, 0L));
        }

        return Map.of("months", months, "tourCounts", tourCounts);
    }

    private void populateTourDetails(Tour tour) {
        if (tour.getSceneIds() != null) {
            List<Scene> scenes = sceneRepository.findAllById(tour.getSceneIds());
            tour.setScenes(scenes);
        }
        if (tour.getPlanId() != null) {
            Plan plan = planRepository.findById(tour.getPlanId()).orElse(null);
            tour.setPlan(plan);
        }
    }
}
