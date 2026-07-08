package com.example.backend.web_controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UserOdgovornoLiceResponse;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/odgovorno-lice")
    public ResponseEntity<List<UserOdgovornoLiceResponse>> getUsersOdgovornoLice() {
        List<UserOdgovornoLiceResponse> users = userRepository.findAllWithOrgEdinica()
                .stream()
                .map(UserOdgovornoLiceResponse::from)
                .toList();
        return ResponseEntity.ok(users);
    }
}
