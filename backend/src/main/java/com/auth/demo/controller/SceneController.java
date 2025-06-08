package com.auth.demo.controller;

import com.auth.demo.models.Hotspot;
import com.auth.demo.models.Scene;
import com.auth.demo.services.SceneService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/scenes")
public class SceneController {

    @Autowired
    private SceneService sceneService;

    @PostMapping("/save")
    public ResponseEntity<List<Scene>> saveScenes(@RequestBody List<Scene> scenes) {
        return ResponseEntity.ok(sceneService.saveScenes(scenes));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteScene(@PathVariable String id) {
        return ResponseEntity.ok(sceneService.deleteScene(id));
    }

    @PutMapping("/update")
    public ResponseEntity<List<Scene>> updateScenes(@RequestBody List<Scene> scenes) {
        return ResponseEntity.ok(sceneService.updateScenes(scenes));
    }

    @PostMapping("/upload")
    public ResponseEntity<Scene> uploadScene(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam(value = "tourId", required = false) String tourId) {
        return ResponseEntity.ok(sceneService.uploadScene(file, name, tourId));
    }

    @GetMapping
    public ResponseEntity<List<Scene>> getAllScenes() {
        return ResponseEntity.ok(sceneService.getAllScenes());
    }

    @PostMapping("/{id}/hotspots")
    public ResponseEntity<Scene> addHotspot(
            @PathVariable String id,
            @RequestBody Hotspot hotspot) {
        return ResponseEntity.ok(sceneService.addHotspot(id, hotspot));
    }
}



// package com.auth.demo.controller;

// import com.auth.demo.models.Hotspot;
// import com.auth.demo.models.Scene;
// import com.auth.demo.models.Tour;
// import com.auth.demo.models.Plan;
// import com.auth.demo.repository.SceneRepository;
// import com.auth.demo.repository.TourRepository;
// import com.auth.demo.repository.PlanRepository;
// import com.auth.demo.services.FileStorageService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.util.ArrayList;
// import java.util.List;
// import java.util.stream.Collectors;

// @RestController
// @CrossOrigin(origins = "http://localhost:5173")
// @RequestMapping("/api/scenes")
// public class SceneController {

//     @Autowired
//     private SceneRepository sceneRepository;

//     @Autowired
//     private FileStorageService fileStorageService;
    
//     @Autowired
//     private TourRepository tourRepository;
    
//     @Autowired
//     private PlanRepository planRepository;
    
//     @Value("${server.url}")
//     private String serverUrl;

//     @PostMapping("/save")
//     public ResponseEntity<List<Scene>> saveScenes(@RequestBody List<Scene> scenes) {
//         try {
//             List<Scene> savedScenes = sceneRepository.saveAll(scenes);
//             System.out.println("Received scenes: " + scenes);
//             System.out.println("Saved scenes: " + savedScenes);
//             return ResponseEntity.ok(savedScenes);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//         }
//     }

//     @DeleteMapping("/delete/{id}")
//     public ResponseEntity<String> deleteScene(@PathVariable String id) {
//         try {
//             Scene scene = sceneRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Scene not found with ID: " + id));

//             // 1. Supprimer les hotspots dans les plans qui pointent vers cette scène
//             List<Plan> plans = planRepository.findAll();
//             for (Plan plan : plans) {
//                 if (plan.getLinks() != null) {
//                     List<Hotspot> updatedHotspots = plan.getLinks().stream()
//                         .filter(hotspot -> !hotspot.getLinkTo().equals(scene.getTextureUrl()))
//                         .collect(Collectors.toList());
                    
//                     if (updatedHotspots.size() != plan.getLinks().size()) {
//                         plan.setLinks(updatedHotspots);
//                         planRepository.save(plan);
//                     }
//                 }
//             }

//             // 2. Supprimer la scène des tours associés
//             List<Tour> tours = tourRepository.findBySceneIdsContaining(id);
//             for (Tour tour : tours) {
//                 tour.getSceneIds().remove(id); 
//                 tourRepository.save(tour); 
//             }

//             // 3. Supprimer la scène elle-même
//             sceneRepository.deleteById(id);

//             return ResponseEntity.ok("Scene and associated hotspots in plans deleted successfully!");
//         } catch (Exception e) {
//             System.err.println("Error deleting scene: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                 .body("Failed to delete scene: " + e.getMessage());
//         }
//     }

//     @PutMapping("/update")
//     public ResponseEntity<List<Scene>> updateScenes(@RequestBody List<Scene> scenes) {
//         try {
//             System.out.println("Request body (scenes to update): " + scenes);

//             List<Scene> updatedScenes = new ArrayList<>();

//             for (Scene scene : scenes) {
//                 if (scene.getId() != null && sceneRepository.existsById(scene.getId())) {
//                     Scene existingScene = sceneRepository.findById(scene.getId())
//                             .orElseThrow(() -> new RuntimeException("Scene not found with ID: " + scene.getId()));

//                     System.out.println("Existing scene before update: " + existingScene);

//                     existingScene.setLinks(scene.getLinks());

//                     Scene updatedScene = sceneRepository.save(existingScene);
//                     updatedScenes.add(updatedScene);

//                     System.out.println("Updated scene: " + updatedScene);
//                 } else {
//                     System.out.println("Scene with ID " + scene.getId() + " does not exist. Skipping update.");
//                 }
//             }

//             System.out.println("All updated scenes: " + updatedScenes);
//             return ResponseEntity.ok(updatedScenes);
//         } catch (Exception e) {
//             System.err.println("Error updating scenes: " + e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//         }
//     }

//     @PostMapping("/upload")
//     public ResponseEntity<Scene> uploadScene(
//             @RequestParam("file") MultipartFile file,
//             @RequestParam("name") String name,
//             @RequestParam(value = "tourId", required = false) String tourId) {
//         try {
//             String filename = fileStorageService.store(file);
//             String imageUrl = serverUrl + "/uploads/" + filename;

//             Scene scene = new Scene(name, imageUrl, new ArrayList<>());
//             Scene savedScene = sceneRepository.save(scene);

//             // Si un tourId est fourni, ajouter la scène au tour
//             if (tourId != null && !tourId.isEmpty()) {
//                 Tour tour = tourRepository.findById(tourId)
//                     .orElseThrow(() -> new RuntimeException("Tour not found with ID: " + tourId));
                
//                 if (tour.getSceneIds() == null) {
//                     tour.setSceneIds(new ArrayList<>());
//                 }
                
//                 tour.getSceneIds().add(savedScene.getId());
//                 tourRepository.save(tour);
//             }

//             return ResponseEntity.ok(savedScene);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//         }
//     }

//     @GetMapping
//     public ResponseEntity<List<Scene>> getAllScenes() {
//         return ResponseEntity.ok(sceneRepository.findAll());
//     }

//     @PostMapping("/{id}/hotspots")
//     public ResponseEntity<Scene> addHotspot(
//             @PathVariable String id,
//             @RequestBody Hotspot hotspot) {
//         Scene scene = sceneRepository.findById(id).orElseThrow(() -> new RuntimeException("Scene not found"));
//         scene.getLinks().add(hotspot);
//         Scene updatedScene = sceneRepository.save(scene);
//         return ResponseEntity.ok(updatedScene);
//     }
// }