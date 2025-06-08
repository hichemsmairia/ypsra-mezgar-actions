package com.auth.demo.dtos;

import lombok.*;

@Data
public class AuthResponse {
    private String token;

    public AuthResponse() {
    }

    private String message;
    private String error ; 
    private Object user ; 
    public AuthResponse(String token, String message , String error , Object user) {
        this.token = token;
        this.message = message;
        this.error = error ; 
        this.user = user ; 
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

