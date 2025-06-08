package com.auth.demo.dtos;

public class PositionVisitCount {
    private Double lat;
    private Double lng;
    private int count;
    private String tourId;

    public PositionVisitCount() {}

    public PositionVisitCount(double lat, double lng, int count, String tourId) {
        this.lat = lat;
        this.lng = lng;
        this.count = count;
        this.tourId = tourId;
    }

    // Getters and setters     

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getTourId() {
        return tourId;
    }

    public void setTourId(String tourId) {
        this.tourId = tourId;
    }
}
