package com.auth.demo.controller;

import com.auth.demo.models.Tour;
import com.auth.demo.services.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "http://localhost:5173")
public class TourController {

    @Autowired
    private TourService tourService;

    @GetMapping
    public ResponseEntity<?> getAllTours() {
        return ResponseEntity.ok(tourService.getAllTours());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTourById(@PathVariable String id) {
        return ResponseEntity.ok(tourService.getTourById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTour(@RequestBody Tour tour) {
        return ResponseEntity.ok(tourService.createTour(tour));
    }

    @PutMapping("/update_tour/{id}")
    public ResponseEntity<?> updateTour(@PathVariable String id, @RequestBody Tour tour) {
        return ResponseEntity.ok(tourService.updateTour(id, tour));
    }

    @DeleteMapping("/delete_tour/{id}")
    public ResponseEntity<?> deleteTour(@PathVariable String id) {
        return ResponseEntity.ok(tourService.deleteTour(id));
    }  

    @PutMapping("/add_scene/{tourId}")
    public ResponseEntity<?> addSceneToTour(@PathVariable String tourId, @RequestBody Map<String, String> request) {
        String sceneId = request.get("sceneId");
        return ResponseEntity.ok(tourService.addSceneToTour(tourId, sceneId));
    }

    @PutMapping("/remove_scene/{tourId}")
    public ResponseEntity<?> removeSceneFromTour(@PathVariable String tourId, @RequestBody Map<String, String> request) {
        String sceneId = request.get("sceneId");
        return ResponseEntity.ok(tourService.removeSceneFromTour(tourId, sceneId));
    }

    @GetMapping("/monthly-tours")
    public ResponseEntity<?> getMonthlyTourCounts() {
        return ResponseEntity.ok(tourService.getMonthlyTourCounts());
    }
}




// package com.auth.demo.controller;

// import com.auth.demo.models.Plan;
// import com.auth.demo.models.Tour;
// import com.auth.demo.models.Scene;
// import com.auth.demo.repository.TourRepository;
// import com.auth.demo.repository.SceneRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.server.ResponseStatusException;

// import java.time.Month;
// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// import com.auth.demo.repository.PlanRepository;

// @RestController
// @RequestMapping("/api/tours")
// @CrossOrigin(origins = "http://localhost:5173")
// public class TourController {

//     @Autowired
//     private TourRepository tourRepository;

//     @Autowired
//     private SceneRepository sceneRepository;

//     @Autowired
//     private PlanRepository planRepository;

//     @GetMapping
//     public ResponseEntity<?> getAllTours() {
//         try {
//             List<Tour> tours = tourRepository.findAll();

//             tours.forEach(tour -> {
//                 if (tour.getSceneIds() != null) {
//                     List<Scene> scenes = sceneRepository.findAllById(tour.getSceneIds());
//                     tour.setScenes(scenes);
//                 }
//                 if (tour.getPlanId() != null) {
//                     Plan plan = planRepository.findById(tour.getPlanId()).orElse(null);
//                     tour.setPlan(plan);
//                 }
//             });

//             return ResponseEntity.ok(tours);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error retrieving tours: " + e.getMessage());
//         }
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<?> getTourById(@PathVariable String id) {
//         try {
//             Tour tour = tourRepository.findById(id)
//                     .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

//             if (tour.getSceneIds() != null) {
//                 List<Scene> scenes = sceneRepository.findAllById(tour.getSceneIds());
//                 tour.setScenes(scenes);
//             }
//             if (tour.getPlanId() != null) {
//                 Plan plan = planRepository.findById(tour.getPlanId()).orElse(null);
//                 tour.setPlan(plan);
//             }

//             return ResponseEntity.ok(tour);  
//         } catch (ResponseStatusException e) {
//             return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error retrieving tour: " + e.getMessage());
//         }
//     }

//     @PostMapping("/create")
//     public ResponseEntity<?> createTour(@RequestBody Tour tour) {
//         System.out.println(tour.getOwnerId());
//         try {
//             if (tour.getPlan() == null) {
//                 tour.setPlan(null);
//             }
//             if (tour.getSceneIds() == null) {
//                 tour.setSceneIds(List.of());
//             }
//             tour.setOwnerId(tour.getOwnerId());
//             tour.setTimeStamp(LocalDateTime.now()); // Assurez-vous que la date de création est enregistrée
//             Tour savedTour = tourRepository.save(tour);
//             return ResponseEntity.status(HttpStatus.CREATED).body(savedTour);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error creating tour: " + e.getMessage());
//         }
//     }

//     @PutMapping("/update_tour/{id}")
//     public ResponseEntity<?> updateTour(@PathVariable String id, @RequestBody Tour updatedTour) {
//         try {
//             Tour existingTour = tourRepository.findById(id)
//                     .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

//             existingTour.setTourName(updatedTour.getTourName());
//             existingTour.setSceneIds(updatedTour.getSceneIds() != null ? updatedTour.getSceneIds() : new ArrayList<>());
//             existingTour.setPlanId(updatedTour.getPlanId());
//             existingTour.setLocalisation(updatedTour.getLocalisation());
//             existingTour.setContactInfos(updatedTour.getContactInfos());
//             existingTour.setOwnerId(updatedTour.getOwnerId());
//             existingTour.setResponsableId(updatedTour.getResponsableId());
//             Tour savedTour = tourRepository.save(existingTour);

//             // Charger les scènes complètes
//             List<Scene> scenes = sceneRepository.findAllById(savedTour.getSceneIds());
//             savedTour.setScenes(scenes != null ? scenes : new ArrayList<>());

//             return ResponseEntity.ok(savedTour);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error updating tour: " + e.getMessage());
//         }
//     }

//     @DeleteMapping("/delete_tour/{id}")
//     public ResponseEntity<?> deleteTour(@PathVariable String id) {
//         try {
//             Tour tour = tourRepository.findById(id)
//                     .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

//             // Supprimer les scènes associées
//             if (tour.getSceneIds() != null && !tour.getSceneIds().isEmpty()) {
//                 sceneRepository.deleteAllById(tour.getSceneIds());
//             }

//             // Supprimer le plan associé s'il existe
//             if (tour.getPlanId() != null) {
//                 planRepository.deleteById(tour.getPlanId());
//             }

//             // Supprimer le tour
//             tourRepository.delete(tour);

//             return ResponseEntity.ok("Tour, associated scenes and plan deleted successfully");
//         } catch (ResponseStatusException e) {
//             return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error deleting tour: " + e.getMessage());
//         }
//     }

//     @PutMapping("/add_scene/{tourId}")
//     public ResponseEntity<?> addSceneToTour(
//             @PathVariable String tourId,
//             @RequestBody Map<String, String> request) {

//         try {
//             String sceneId = request.get("sceneId");
//             Tour tour = tourRepository.findById(tourId)
//                     .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

//             // Initialiser sceneIds si null
//             if (tour.getSceneIds() == null) {
//                 tour.setSceneIds(new ArrayList<>());
//             }

//             // Vérifier si la scène existe déjà dans le tour
//             if (!tour.getSceneIds().contains(sceneId)) {
//                 tour.getSceneIds().add(sceneId);
//                 tourRepository.save(tour);
//             }

//             // Charger les scènes complètes pour la réponse
//             List<Scene> scenes = sceneRepository.findAllById(tour.getSceneIds());
//             tour.setScenes(scenes);

//             return ResponseEntity.ok(tour);
//         } catch (ResponseStatusException e) {
//             return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error adding scene to tour: " + e.getMessage());
//         }
//     }

//     @PutMapping("/remove_scene/{tourId}")
//     public ResponseEntity<?> removeSceneFromTour(
//             @PathVariable String tourId,
//             @RequestBody Map<String, String> request) {

//         try {
//             String sceneId = request.get("sceneId");
//             Tour tour = tourRepository.findById(tourId)
//                     .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

//             if (tour.getSceneIds() != null) {
//                 tour.getSceneIds().remove(sceneId);
//                 tourRepository.save(tour);
//             }

//             // Charger les scènes restantes pour la réponse
//             if (tour.getSceneIds() != null && !tour.getSceneIds().isEmpty()) {
//                 List<Scene> scenes = sceneRepository.findAllById(tour.getSceneIds());
//                 tour.setScenes(scenes);
//             } else {
//                 tour.setScenes(new ArrayList<>());
//             }

//             return ResponseEntity.ok(tour);
//         } catch (ResponseStatusException e) {
//             return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error removing scene from tour: " + e.getMessage());
//         }
//     }

//     @GetMapping("/monthly-tours")
//     public ResponseEntity<?> getMonthlyTourCounts() {
//         try {
//             List<Tour> allTours = tourRepository.findAll();
//             Map<Month, Long> monthlyCounts = allTours.stream()
//                     .collect(Collectors.groupingBy(
//                             tour -> tour.getTimeStamp().getMonth(),
//                             Collectors.counting()
//                     ));

//             // Préparer les données pour le graphique
//             List<String> months = new ArrayList<>();
//             List<Long> tourCounts = new ArrayList<>();

//             // Assurer que tous les mois sont présents, même avec un count de 0
//             for (int i = 1; i <= 12; i++) {
//                 Month month = Month.of(i);
//                 months.add(month.toString().substring(0, 3)); // Obtient l'abréviation du mois
//                 tourCounts.add(monthlyCounts.getOrDefault(month, 0L));
//             }

//             Map<String, Object> response = Map.of("months", months, "tourCounts", tourCounts);
//             return ResponseEntity.ok(response);

//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error retrieving monthly tour counts: " + e.getMessage());
//         }
//     }
// }