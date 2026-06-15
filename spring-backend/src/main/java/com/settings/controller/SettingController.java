package com.settings.controller;

import com.settings.dto.ApiResponse;
import com.settings.dto.SettingRequest;
import com.settings.model.Setting;
import com.settings.service.SettingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/settings")
public class SettingController {
    
    @Autowired
    private SettingService settingService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse> createSetting(@Valid @RequestBody SettingRequest request) {
        try {
            Setting setting = settingService.createSetting(request);
            return ResponseEntity.ok(new ApiResponse(true, "Setting created successfully", setting));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse> getAllSettings() {
        List<Setting> settings = settingService.getAllSettings();
        return ResponseEntity.ok(new ApiResponse(true, "Settings retrieved successfully", settings));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse> getSettingById(@PathVariable Long id) {
        try {
            Setting setting = settingService.getSettingById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Setting retrieved successfully", setting));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse> updateSetting(@PathVariable Long id, 
                                                     @Valid @RequestBody SettingRequest request) {
        try {
            Setting setting = settingService.updateSetting(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Setting updated successfully", setting));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteSetting(@PathVariable Long id) {
        try {
            settingService.deleteSetting(id);
            return ResponseEntity.ok(new ApiResponse(true, "Setting deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse> getSettingsByCategory(@PathVariable Long categoryId) {
        List<Setting> settings = settingService.getSettingsByCategory(categoryId);
        return ResponseEntity.ok(new ApiResponse(true, "Settings retrieved successfully", settings));
    }
    
    @GetMapping("/scope/{scope}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse> getSettingsByScope(@PathVariable String scope) {
        try {
            List<Setting> settings = settingService.getSettingsByScope(scope);
            return ResponseEntity.ok(new ApiResponse(true, "Settings retrieved successfully", settings));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
