package com.settings.service;

import com.settings.dto.SettingRequest;
import com.settings.model.Setting;
import com.settings.model.SettingCategory;
import com.settings.model.SettingScope;
import com.settings.model.User;
import com.settings.repository.SettingCategoryRepository;
import com.settings.repository.SettingRepository;
import com.settings.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SettingService {
    
    @Autowired
    private SettingRepository settingRepository;
    
    @Autowired
    private SettingCategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditLogService auditLogService;
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional
    public Setting createSetting(SettingRequest request) {
        User currentUser = getCurrentUser();
        
        SettingCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Setting setting = new Setting();
        setting.setKey(request.getKey());
        setting.setValue(request.getValue());
        setting.setDescription(request.getDescription());
        setting.setCategory(category);
        setting.setScope(request.getScope());
        setting.setUserId(request.getUserId());
        setting.setCreatedBy(currentUser.getId());
        setting.setUpdatedBy(currentUser.getId());
        
        Setting savedSetting = settingRepository.save(setting);
        
        auditLogService.log("CREATE", "Setting", savedSetting.getId(), 
                currentUser.getId(), "Created setting: " + savedSetting.getKey());
        
        return savedSetting;
    }
    
    public List<Setting> getAllSettings() {
        return settingRepository.findAll();
    }
    
    public Setting getSettingById(Long id) {
        return settingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setting not found"));
    }
    
    @Transactional
    public Setting updateSetting(Long id, SettingRequest request) {
        User currentUser = getCurrentUser();
        
        Setting setting = getSettingById(id);
        
        SettingCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        setting.setKey(request.getKey());
        setting.setValue(request.getValue());
        setting.setDescription(request.getDescription());
        setting.setCategory(category);
        setting.setScope(request.getScope());
        setting.setUserId(request.getUserId());
        setting.setUpdatedBy(currentUser.getId());
        
        Setting updatedSetting = settingRepository.save(setting);
        
        auditLogService.log("UPDATE", "Setting", updatedSetting.getId(), 
                currentUser.getId(), "Updated setting: " + updatedSetting.getKey());
        
        return updatedSetting;
    }
    
    @Transactional
    public void deleteSetting(Long id) {
        User currentUser = getCurrentUser();
        Setting setting = getSettingById(id);
        
        auditLogService.log("DELETE", "Setting", setting.getId(), 
                currentUser.getId(), "Deleted setting: " + setting.getKey());
        
        settingRepository.deleteById(id);
    }
    
    public List<Setting> getSettingsByCategory(Long categoryId) {
        return settingRepository.findByCategoryId(categoryId);
    }
    
    public List<Setting> getSettingsByScope(String scope) {
        return settingRepository.findByScope(SettingScope.valueOf(scope.toUpperCase()));
    }
}
