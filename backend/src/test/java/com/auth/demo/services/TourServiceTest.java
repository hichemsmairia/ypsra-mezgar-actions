package com.auth.demo.services;

import com.auth.demo.models.Plan;
import com.auth.demo.models.Scene;
import com.auth.demo.models.Tour;
import com.auth.demo.repository.PlanRepository;
import com.auth.demo.repository.SceneRepository;
import com.auth.demo.repository.TourRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TourServiceTest {

    @InjectMocks
    private TourService tourService;

    @Mock
    private TourRepository tourRepository;

    @Mock
    private SceneRepository sceneRepository;

    @Mock
    private PlanRepository planRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllTours() {
        List<Tour> tours = List.of(new Tour(
            "1", "Tour1", new ArrayList<>(), null, null, null, null, null,
            LocalDateTime.now(), null
        ));
        when(tourRepository.findAll()).thenReturn(tours);
        List<Tour> result = tourService.getAllTours();
        assertEquals(1, result.size());
        verify(tourRepository).findAll();
    }

    @Test
    void testGetTourByIdSuccess() {
        Tour tour = new Tour(
            "1", "Tour1", new ArrayList<>(), null, null, null, null, null,
            LocalDateTime.now(), null
        );
        when(tourRepository.findById("1")).thenReturn(Optional.of(tour));
        Tour result = tourService.getTourById("1");
        assertEquals("Tour1", result.getTourName());
        verify(tourRepository).findById("1");
    }

    @Test
    void testCreateTour() {
        Tour newTour = new Tour(
            "1", "Tour1", new ArrayList<>(), null, null, null, null, null,
            LocalDateTime.now(), null
        );
        when(tourRepository.save(any(Tour.class))).thenAnswer(i -> i.getArguments()[0]);
        Tour result = tourService.createTour(newTour);
        assertNotNull(result.getTimeStamp());
        assertEquals("Tour1", result.getTourName());
    }

    @Test
    void testUpdateTourSuccess() {
        Tour existing = new Tour(
            "1", "Tour1", new ArrayList<>(), null, null, null, null, null,
            LocalDateTime.now(), null
        );
        Tour updated = new Tour(
            "1", "Updated Tour",
            new ArrayList<>(List.of("scene1")),
            null,
            "plan2",
            null,
            new ArrayList<>(List.of(34.0, 8.0)),
            new ArrayList<>(List.of("contact@example.com")),
            LocalDateTime.now(),
            null
        );
        when(tourRepository.findById("1")).thenReturn(Optional.of(existing));
        when(tourRepository.save(any(Tour.class))).thenAnswer(i -> i.getArguments()[0]);

        Tour result = tourService.updateTour("1", updated);

        assertEquals("Updated Tour", result.getTourName());
        assertEquals(List.of("scene1"), result.getSceneIds());
        assertEquals("plan2", result.getPlanId());
        assertEquals(List.of(34.0, 8.0), result.getLocalisation());
    }

    @Test
    void testAddSceneToTour() {
        Tour tour = new Tour(
            "1", "Tour1", new ArrayList<>(), null, null, null, null, null,
            LocalDateTime.now(), null
        );
        when(tourRepository.findById("1")).thenReturn(Optional.of(tour));
        when(tourRepository.save(any(Tour.class))).thenAnswer(i -> i.getArguments()[0]);

        Tour result = tourService.addSceneToTour("1", "scene1");

        assertTrue(result.getSceneIds().contains("scene1"));
    }

    @Test
    void testRemoveSceneFromTour() {
        List<String> scenes = new ArrayList<>();
        scenes.add("scene1");
        Tour tour = new Tour(
            "1", "Tour1", scenes, null, null, null, null, null,
            LocalDateTime.now(), null
        );
        when(tourRepository.findById("1")).thenReturn(Optional.of(tour));
        when(tourRepository.save(any(Tour.class))).thenAnswer(i -> i.getArguments()[0]);

        Tour result = tourService.removeSceneFromTour("1", "scene1");

        assertFalse(result.getSceneIds().contains("scene1"));
    }

    @Test
    void testDeleteTour() {
        List<String> scenes = new ArrayList<>();
        scenes.add("scene1");
        scenes.add("scene2");

        // Make sure planId matches what you verify
        Tour tour = new Tour(
            "1", "Tour1", scenes, null, "plan1", null, null, null,
            LocalDateTime.now(), null
        );
        when(tourRepository.findById("1")).thenReturn(Optional.of(tour));

        String result = tourService.deleteTour("1");

        assertEquals("Tour, associated scenes and plan deleted successfully", result);
        verify(sceneRepository).deleteAllById(tour.getSceneIds());
        verify(planRepository).deleteById("plan1");
        verify(tourRepository).delete(tour);
    }

    @Test
    void testGetMonthlyTourCounts() {
        LocalDateTime jan = LocalDateTime.of(2025, 1, 10, 10, 0);
        LocalDateTime feb = LocalDateTime.of(2025, 2, 10, 10, 0);

        List<Tour> tours = List.of(
            new Tour("1", "Tour1", new ArrayList<>(), null, null, null, null, null, jan, null),
            new Tour("2", "Tour2", new ArrayList<>(), null, null, null, null, null, jan, null),
            new Tour("3", "Tour3", new ArrayList<>(), null, null, null, null, null, feb, null)
        );

        when(tourRepository.findAll()).thenReturn(tours);

        Map<String, Object> result = tourService.getMonthlyTourCounts();

        @SuppressWarnings("unchecked")
        List<Long> counts = (List<Long>) result.get("tourCounts");

        assertEquals(2, counts.get(0)); // January count
        assertEquals(1, counts.get(1)); // February count
        assertEquals(0, counts.get(2)); // March count (expected 0)
    }
}
