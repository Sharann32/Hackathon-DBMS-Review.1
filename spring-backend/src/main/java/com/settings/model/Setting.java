package com.settings.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "settings")
public class Setting {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String key;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;
    
    @Column(length = 500)
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private SettingCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SettingScope scope = SettingScope.SYSTEM;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public Setting() {}
    
    public Setting(Long id, String key, String value, String description, SettingCategory category, 
                   SettingScope scope, Long userId, Long createdBy, Long updatedBy, 
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.key = key;
        this.value = value;
        this.description = description;
        this.category = category;
        this.scope = scope;
        this.userId = userId;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public SettingCategory getCategory() { return category; }
    public void setCategory(SettingCategory category) { this.category = category; }
    
    public SettingScope getScope() { return scope; }
    public void setScope(SettingScope scope) { this.scope = scope; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
