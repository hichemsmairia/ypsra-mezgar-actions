package com.auth.demo.services;

import com.auth.demo.models.Hotspot;
import com.auth.demo.models.Plan;
import com.auth.demo.models.Tour;
import com.auth.demo.repository.PlanRepository;
import com.auth.demo.repository.TourRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private TourRepository tourRepository;

    @Value("${server.url}")
    private String serverUrl;

    public Plan uploadPlan(MultipartFile file, String planHotspotsJson) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        List<Hotspot> planHotspots = Arrays.asList(mapper.readValue(planHotspotsJson, Hotspot[].class));

        String filename = fileStorageService.store(file);
        String imageUrl = serverUrl + "/uploads/" + filename;

        Plan plan = new Plan(imageUrl, planHotspots);
        return planRepository.save(plan);
    }

    public void deletePlan(String id) {
        List<Tour> tours = tourRepository.findByPlanId(id);
        for (Tour tour : tours) {
            tour.setPlanId(null);
            tour.setPlan(null);
            tourRepository.save(tour);
        }
        planRepository.deleteById(id);
    }

    public Plan updatePlan(String id, Plan updatedPlan) {
        Plan existingPlan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));
        existingPlan.setLinks(updatedPlan.getLinks());
        return planRepository.save(existingPlan);
    }
}
