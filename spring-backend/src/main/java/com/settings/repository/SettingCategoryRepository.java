package com.settings.repository;

import com.settings.model.SettingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingCategoryRepository extends JpaRepository<SettingCategory, Long> {
    Optional<SettingCategory> findByName(String name);
    Boolean existsByName(String name);
}
