package com.auth.demo.models;

public class Hotspot {
    private String name;
    private String linkTo;
    private double[] position;

    public Hotspot() {}

    public Hotspot(String name, String linkTo, double[] position) {
        this.name = name;
        this.linkTo = linkTo;
        this.position = position;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLinkTo() {
        return linkTo;
    }

    public void setLinkTo(String linkTo) {
        this.linkTo = linkTo;
    }

    public double[] getPosition() {
        return position;
    }

    public void setPosition(double[] position) {
        this.position = position;
    }
}