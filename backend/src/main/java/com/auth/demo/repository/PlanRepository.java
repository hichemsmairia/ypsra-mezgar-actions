package com.auth.demo.repository;

import com.auth.demo.models.Plan;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlanRepository extends MongoRepository<Plan, String> {
    List<Plan> findByLinksLinkTo(String linkTo);
}