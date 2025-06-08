package com.auth.demo.repository;


import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.auth.demo.models.Visitor;

import java.util.List;

import com.auth.demo.dtos.PositionVisitCount;

public interface VisitorRepository extends MongoRepository<Visitor, String> {
    @Aggregation(pipeline = {
        "{ $project: { " +
            "tourId: 1, " +
            "latRounded: { $round: [\"$position.latitude\", 1] }, " +
            "lngRounded: { $round: [\"$position.longitude\", 1] } " +
        "} }",
        "{ $group: { _id: { tourId: \"$tourId\", lat: \"$latRounded\", lng: \"$lngRounded\" }, count: { $sum: 1 } } }",
        "{ $project: { tourId: \"$_id.tourId\", lat: \"$_id.lat\", lng: \"$_id.lng\", count: 1, _id: 0 } }",
        "{ $sort: { count: -1 } }"
    })
    List<PositionVisitCount> countVisitsByApproxPosition();
    @Override
    List<Visitor> findAll();
}
