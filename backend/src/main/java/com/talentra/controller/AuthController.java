package com.talentra.controller;

import com.talentra.dto.ApiResponse;
import com.talentra.dto.AuthResponse;
import com.talentra.dto.LoginRequest;
import com.talentra.dto.RegisterRequest;
import com.talentra.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(ApiResponse.success(response, "Registration successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(org.springframework.security.core.Authentication authentication) {
        com.talentra.entity.User user = authService.getUserByEmail(authentication.getName());
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("user", user);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
