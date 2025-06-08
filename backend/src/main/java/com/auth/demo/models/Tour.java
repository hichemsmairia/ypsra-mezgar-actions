package com.auth.demo.models;

import java.util.List;
import java.time.LocalDateTime;

public class Tour {
    private String id;
    private String tourName;
    private List<String> sceneIds;
    private List<Scene> scenes;
    private String planId ;
    private Plan plan;  
    private List<Double> localisation ;
    private List<String> contactInfos ;
    private LocalDateTime timeStamp; 
    private String ownerId;
    
    public Tour() {
        this.timeStamp = LocalDateTime.now(); 
    }

    public Tour(String id, String tourName, List<String> sceneIds, List<Scene> scenes, String planId ,  Plan plan, List<Double> localisation , List<String> contactInfos, LocalDateTime timeStamp,String ownerId) {
        this.id = id;
        this.tourName = tourName;
        this.sceneIds = sceneIds;
        this.scenes = scenes;
        this.planId = planId ;
        this.plan = plan;
        this.localisation  = localisation;
        this.contactInfos = contactInfos ;
        this.timeStamp = timeStamp;
        this.ownerId = ownerId;
    }

    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

  

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }


public List<Double> getLocalisation() {
        return localisation;
    }

    public void setLocalisation(List<Double> localisation) {
        this.localisation = localisation;
    }


public List<String> getContactInfos() {
        return contactInfos;
    }

    public void setContactInfos(List<String> contactInfos) {
        this.contactInfos = contactInfos;
    }


    public List<String> getSceneIds() {
        return sceneIds;
    }



    public void setSceneIds(List<String> sceneIds) {
        this.sceneIds = sceneIds;
    }


public String getPlanId() {
        return planId;
    }


    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public List<Scene> getScenes() {
        return scenes;
    }

    public void setScenes(List<Scene> scenes) {
        this.scenes = scenes;
    }

    
    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }
}