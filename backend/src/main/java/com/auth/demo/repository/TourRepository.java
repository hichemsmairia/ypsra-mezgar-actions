package com.auth.demo.repository;

import com.auth.demo.models.Tour;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TourRepository extends MongoRepository<Tour, String> {
    List<Tour> findBySceneIdsContaining(String sceneId);
    List<Tour> findByPlanId(String planId);
}