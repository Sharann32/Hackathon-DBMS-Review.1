package com.settings.controller;

import com.settings.dto.ApiResponse;
import com.settings.dto.CategoryRequest;
import com.settings.model.SettingCategory;
import com.settings.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        try {
            SettingCategory category = categoryService.createCategory(request);
            return ResponseEntity.ok(new ApiResponse(true, "Category created successfully", category));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse> getAllCategories() {
        List<SettingCategory> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse(true, "Categories retrieved successfully", categories));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long id) {
        try {
            SettingCategory category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Category retrieved successfully", category));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateCategory(@PathVariable Long id, 
                                                      @Valid @RequestBody CategoryRequest request) {
        try {
            SettingCategory category = categoryService.updateCategory(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Category updated successfully", category));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponse(true, "Category deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
