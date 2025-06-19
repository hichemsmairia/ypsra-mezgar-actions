package com.auth.demo.controller;

import com.auth.demo.models.Plan;
import com.auth.demo.services.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/plans")
public class PlanController {

    @Autowired
    private PlanService planService;

    @PostMapping("/upload_plan")
    public ResponseEntity<Plan> uploadPlan(
            @RequestParam("file") MultipartFile file,
            @RequestParam("planHotspots") String planHotspotsJson,
            Authentication authentication // This will be automatically populated if user is authenticated
    ) {
        try {  
            // You can access the authenticated user's email if needed
            String userEmail = authentication.getName();
            System.out.println("Uploading plan for user: " + userEmail);
            
            Plan savedPlan = planService.uploadPlan(file, planHotspotsJson);
            return ResponseEntity.ok(savedPlan);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePlan(@PathVariable String id) {
        try {
            planService.deletePlan(id);
            return ResponseEntity.ok("Plan deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting plan: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable String id, @RequestBody Plan updatedPlan) {
        try {
            Plan savedPlan = planService.updatePlan(id, updatedPlan);
            return ResponseEntity.ok(savedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}