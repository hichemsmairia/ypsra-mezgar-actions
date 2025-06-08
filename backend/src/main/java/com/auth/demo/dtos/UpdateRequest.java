package com.auth.demo.dtos;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

public class UpdateRequest {

    private String username;
    private String email;
    private String password;
      private Set<String> roles = new HashSet<>();
    private MultipartFile image;

    public UpdateRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

   public Set<String> getRoles() {
        return roles;
    }
    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }
}
