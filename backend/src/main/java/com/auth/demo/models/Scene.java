package com.auth.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "scenes")
public class Scene {
    
    @Id
    private String id;
    private String name;
    private String textureUrl;
    
    private List<Hotspot> links;



    
    public Scene() {}

    public Scene(String name, String textureUrl, List<Hotspot> links) {
        this.name = name;
        this.textureUrl = textureUrl;
        this.links = links;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTextureUrl() {
        return textureUrl;
    }

    public void setTextureUrl(String textureUrl) {
        this.textureUrl = textureUrl;
    }

    public List<Hotspot> getLinks() {
        return links;
    }

    public void setLinks(List<Hotspot> links) {
        this.links = links;
    }
    
}