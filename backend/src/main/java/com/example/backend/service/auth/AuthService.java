package com.example.backend.service.auth;


import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.exceptions.BadRequestException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.OrganizaciskaEdinica;
import com.example.backend.model.UserTable;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.orgEdinicaRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final orgEdinicaRepository organizaciskaRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthService(orgEdinicaRepository organizaciskaRepository, UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       CustomUserDetailsService customUserDetailsService) {
        this.organizaciskaRepository = organizaciskaRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
    }

    public AuthResponse login(LoginRequest request) {
        UserTable user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadCredentialsException("Погрешен email или лозинка"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Погрешен email или лозинка");
        }

        var userDetails = customUserDetailsService
                .loadUserByUsername(user.getEmail());

        String token = jwtService.generateToken(
                userDetails,
                user.getId(),
                user.getUloga(),
                user.getOrganizaciskaEdinica() != null
                        ? user.getOrganizaciskaEdinica().getId() : null
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getIme(),
                user.getPrezime(),
                user.getEmail(),
                user.getUloga(),
                user.getOrganizaciskaEdinica() != null
                        ? user.getOrganizaciskaEdinica().getId() : null
        );
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException(
                    "Корисник со овој email веќе постои");
        }

        UserTable user = new UserTable();
        OrganizaciskaEdinica  organizaciska = organizaciskaRepository.findById(request.getOrganizaciskaEdinicaId())
                .orElseThrow(()->new ResourceNotFoundException("Организациска единица",request.getOrganizaciskaEdinicaId()));
        user.setIme(request.getIme());
        user.setPrezime(request.getPrezime());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUloga(request.getUloga() != null
                ? request.getUloga() : "OSL");
        user.setOrganizaciskaEdinica(organizaciska);

        userRepository.save(user);

        return login(new LoginRequest() {
            { }
            public String getEmail() { return request.getEmail(); }
            public String getPassword() { return request.getPassword(); }
        });
    }
}
