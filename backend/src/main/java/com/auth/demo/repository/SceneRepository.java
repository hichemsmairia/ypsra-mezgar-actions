package com.auth.demo.repository;

import com.auth.demo.models.Scene;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SceneRepository extends MongoRepository<Scene, String> {
}