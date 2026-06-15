package com.settings.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private Set<String> roles;
    
    public UserResponse() {}
    
    public UserResponse(Long id, String name, String email, Boolean enabled, LocalDateTime createdAt, LocalDateTime lastLogin, Set<String> roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.roles = roles;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
