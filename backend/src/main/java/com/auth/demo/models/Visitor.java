package com.auth.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

import com.auth.demo.dtos.Position;

@Document("visitors")
public class Visitor {
    @Id
    private String id;
    private String tourId;
    private LocalDateTime visitedAt;

    private Position position; 

    public Visitor() {}

    public Visitor(String tourId, LocalDateTime visitedAt, Position position) {
        this.tourId = tourId;
        this.visitedAt = visitedAt;
        this.position = position;
    }

    
    public String getId() {
        return id;
    }

    public String getTourId() {
        return tourId;
    }

    public void setTourId(String tourId) {
        this.tourId = tourId;
    }

    public LocalDateTime getVisitedAt() {
        return visitedAt;
    }

    public void setVisitedAt(LocalDateTime visitedAt) {
        this.visitedAt = visitedAt;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public void setId(String id) {
        this.id = id;
    }
}
