package com.settings.service;

import com.settings.dto.CategoryRequest;
import com.settings.model.SettingCategory;
import com.settings.model.User;
import com.settings.repository.SettingCategoryRepository;
import com.settings.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    
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
    public SettingCategory createCategory(CategoryRequest request) {
        User currentUser = getCurrentUser();
        
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists");
        }
        
        SettingCategory category = new SettingCategory();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        SettingCategory savedCategory = categoryRepository.save(category);
        
        auditLogService.log("CREATE", "Category", savedCategory.getId(), 
                currentUser.getId(), "Created category: " + savedCategory.getName());
        
        return savedCategory;
    }
    
    public List<SettingCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public SettingCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
    
    @Transactional
    public SettingCategory updateCategory(Long id, CategoryRequest request) {
        User currentUser = getCurrentUser();
        
        SettingCategory category = getCategoryById(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        SettingCategory updatedCategory = categoryRepository.save(category);
        
        auditLogService.log("UPDATE", "Category", updatedCategory.getId(), 
                currentUser.getId(), "Updated category: " + updatedCategory.getName());
        
        return updatedCategory;
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        User currentUser = getCurrentUser();
        SettingCategory category = getCategoryById(id);
        
        auditLogService.log("DELETE", "Category", category.getId(), 
                currentUser.getId(), "Deleted category: " + category.getName());
        
        categoryRepository.deleteById(id);
    }
}
