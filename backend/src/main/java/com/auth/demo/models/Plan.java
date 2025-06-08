package com.auth.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "plans")
public class Plan {
    
    @Id
    private String id;
    
    private String imagePlan;
    
    private List<Hotspot> links;



    
    public Plan() {}

    public Plan( String imagePlan, List<Hotspot> links) {
     
        this.imagePlan = imagePlan;
        this.links = links;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    

    public String getImagePlan() {
        return imagePlan;
    }

    public void setImagePlan(String imagePlan) {
        
        this.imagePlan = imagePlan;
    }

    public List<Hotspot> getLinks() {
        return links;
    }

    public void setLinks(List<Hotspot> links) {
        this.links = links;
    }
    
}