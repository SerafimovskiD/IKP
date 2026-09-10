package com.example.backend.web_controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UserOdgovornoLiceResponse;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.Role;
import com.example.backend.model.UserTable;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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

    // Ги враќа корисниците (за "Одговорно лице" / "Доделено на") - scope-ирано на
    // орг. единицата на најавениот корисник. ADMIN ги гледа сите.
    @GetMapping("/odgovorno-lice")
    public ResponseEntity<List<UserOdgovornoLiceResponse>> getUsersOdgovornoLice(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserTable caller = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<UserTable> source = (caller.getUloga() == Role.ADMIN || caller.getOrganizaciskaEdinica() == null)
                ? userRepository.findAllWithOrgEdinica()
                : userRepository.findAllByOrgEdinicaId(caller.getOrganizaciskaEdinica().getId());

        List<UserOdgovornoLiceResponse> users = source.stream()
                .map(UserOdgovornoLiceResponse::from)
                .toList();
        return ResponseEntity.ok(users);
    }
}
