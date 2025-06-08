package com.auth.demo.services;

import com.auth.demo.models.Hotspot;
import com.auth.demo.models.Plan;
import com.auth.demo.models.Scene;
import com.auth.demo.models.Tour;
import com.auth.demo.repository.PlanRepository;
import com.auth.demo.repository.SceneRepository;
import com.auth.demo.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SceneService {

    @Autowired
    private SceneRepository sceneRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private PlanRepository planRepository;

    @Value("${server.url}")
    private String serverUrl;

    public List<Scene> saveScenes(List<Scene> scenes) {
        return sceneRepository.saveAll(scenes);
    }

    public String deleteScene(String id) {
        Scene scene = sceneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scene not found with ID: " + id));

        List<Plan> plans = planRepository.findAll();
        for (Plan plan : plans) {
            if (plan.getLinks() != null) {
                List<Hotspot> updatedHotspots = plan.getLinks().stream()
                        .filter(hotspot -> !hotspot.getLinkTo().equals(scene.getTextureUrl()))
                        .collect(Collectors.toList());

                if (updatedHotspots.size() != plan.getLinks().size()) {
                    plan.setLinks(updatedHotspots);
                    planRepository.save(plan);
                }
            }
        }

        List<Tour> tours = tourRepository.findBySceneIdsContaining(id);
        for (Tour tour : tours) {
            tour.getSceneIds().remove(id);
            tourRepository.save(tour);
        }

        sceneRepository.deleteById(id);
        return "Scene and associated hotspots in plans deleted successfully!";
    }

    public List<Scene> updateScenes(List<Scene> scenes) {
        List<Scene> updatedScenes = new ArrayList<>();

        for (Scene scene : scenes) {
            if (scene.getId() != null && sceneRepository.existsById(scene.getId())) {
                Scene existingScene = sceneRepository.findById(scene.getId())
                        .orElseThrow(() -> new RuntimeException("Scene not found with ID: " + scene.getId()));

                existingScene.setLinks(scene.getLinks());
                Scene updatedScene = sceneRepository.save(existingScene);
                updatedScenes.add(updatedScene);
            }
        }
        return updatedScenes;
    }

    public Scene uploadScene(MultipartFile file, String name, String tourId) {
        String filename = fileStorageService.store(file);
        String imageUrl = serverUrl + "/uploads/" + filename;

        Scene scene = new Scene(name, imageUrl, new ArrayList<>());
        Scene savedScene = sceneRepository.save(scene);

        if (tourId != null && !tourId.isEmpty()) {
            Tour tour = tourRepository.findById(tourId)
                    .orElseThrow(() -> new RuntimeException("Tour not found with ID: " + tourId));

            if (tour.getSceneIds() == null) {
                tour.setSceneIds(new ArrayList<>());
            }

            tour.getSceneIds().add(savedScene.getId());
            tourRepository.save(tour);
        }

        return savedScene;
    }

    public List<Scene> getAllScenes() {
        return sceneRepository.findAll();
    }

    public Scene addHotspot(String id, Hotspot hotspot) {
        Scene scene = sceneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scene not found"));
        scene.getLinks().add(hotspot);
        return sceneRepository.save(scene);
    }
}
