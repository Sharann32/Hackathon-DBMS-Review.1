package com.settings.dto;

import com.settings.model.SettingScope;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SettingRequest {
    
    @NotBlank(message = "Key is required")
    private String key;
    
    @NotBlank(message = "Value is required")
    private String value;
    
    private String description;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    @NotNull(message = "Scope is required")
    private SettingScope scope;
    
    private Long userId;
    
    // Constructors
    public SettingRequest() {}
    
    public SettingRequest(String key, String value, String description, Long categoryId, SettingScope scope, Long userId) {
        this.key = key;
        this.value = value;
        this.description = description;
        this.categoryId = categoryId;
        this.scope = scope;
        this.userId = userId;
    }
    
    // Getters and Setters
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public SettingScope getScope() { return scope; }
    public void setScope(SettingScope scope) { this.scope = scope; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
