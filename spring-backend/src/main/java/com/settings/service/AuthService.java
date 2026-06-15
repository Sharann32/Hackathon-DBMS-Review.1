package com.settings.service;

import com.settings.dto.AuthResponse;
import com.settings.dto.LoginRequest;
import com.settings.dto.RegisterRequest;
import com.settings.model.Role;
import com.settings.model.User;
import com.settings.repository.RoleRepository;
import com.settings.repository.UserRepository;
import com.settings.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        
        // Get role from request (default to USER if not specified or invalid)
        String requestedRole = request.getRole();
        if (requestedRole == null || requestedRole.isEmpty()) {
            requestedRole = "USER";
        }
        
        // Ensure role has ROLE_ prefix
        if (!requestedRole.startsWith("ROLE_")) {
            requestedRole = "ROLE_" + requestedRole;
        }
        
        // Find or create the role
        final String roleName = requestedRole;
        Role userRole = roleRepository.findByRoleName(roleName)
                .orElseGet(() -> {
                    Role newRole = new Role(roleName);
                    return roleRepository.save(newRole);
                });
        
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        
        // Generate token
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(savedUser.getEmail())
                .password(savedUser.getPassword())
                .authorities(savedUser.getRoles().stream()
                        .map(role -> role.getRoleName().startsWith("ROLE_") 
                            ? role.getRoleName() 
                            : "ROLE_" + role.getRoleName())
                        .collect(Collectors.toList()).toArray(new String[0]))
                .build();
        
        String token = jwtUtil.generateToken(userDetails);
        
        Set<String> roleNames = savedUser.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());
        
        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), 
                savedUser.getEmail(), roleNames);
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update last login timestamp
        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);
        
        Set<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());
        
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), roles);
    }
}
