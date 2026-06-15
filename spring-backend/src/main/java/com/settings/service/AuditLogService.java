package com.settings.service;

import com.settings.model.AuditLog;
import com.settings.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Transactional
    public void log(String action, String entityName, Long entityId, Long performedBy, String details) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setEntityName(entityName);
        auditLog.setEntityId(entityId);
        auditLog.setPerformedBy(performedBy);
        auditLog.setDetails(details);
        
        auditLogRepository.save(auditLog);
    }
    
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }
}
