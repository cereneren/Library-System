package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.repository.UserRepository;
import com.example.LibrarySystem.service.AuthenticationService;
import com.example.LibrarySystem.jwt.JwtUtil;
import com.example.LibrarySystem.dto.LoginDto;
import com.example.LibrarySystem.dto.RegisterDto;
import com.example.LibrarySystem.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationService authSvc;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;

    public AuthController(AuthenticationService authSvc, JwtUtil jwtUtil, UserRepository userRepo) {
        this.authSvc = authSvc;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterDto dto) {
        User created = authSvc.signup(dto);
        return ResponseEntity
                .created(URI.create("/api/users/" + created.getId()))
                .body(Map.of("message", "User created", "id", created.getId()));
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginDto dto) {
        // authenticate and get the token
        String token = authSvc.login(dto, jwtUtil);
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("…"));

        return Map.of(
                "token", token,
                "user_type", user.getUserType()
        );
    }
}

