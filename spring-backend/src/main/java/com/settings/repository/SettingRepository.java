package com.settings.repository;

import com.settings.model.Setting;
import com.settings.model.SettingScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {
    Optional<Setting> findByKey(String key);
    List<Setting> findByCategoryId(Long categoryId);
    List<Setting> findByScope(SettingScope scope);
    List<Setting> findByUserId(Long userId);
    List<Setting> findByScopeAndUserId(SettingScope scope, Long userId);
}
