// src/main/java/com/auth/demo/dtos/TrackVisitorRequest.java
package com.auth.demo.dtos;

public class TrackVisitorRequest {
    private String tourId;
    private Position position;

    public String getTourId() {
        return tourId;
    }

    public void setTourId(String tourId) {
        this.tourId = tourId;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }
}
