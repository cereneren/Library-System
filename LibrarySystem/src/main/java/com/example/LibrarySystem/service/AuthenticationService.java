package com.example.LibrarySystem.service;

import com.example.LibrarySystem.jwt.JwtUtil;
import com.example.LibrarySystem.dto.LoginDto;
import com.example.LibrarySystem.dto.RegisterDto;
import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.model.User;
import com.example.LibrarySystem.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;

    public AuthenticationService(UserRepository repo,
                                 AuthenticationManager authManager,
                                 PasswordEncoder encoder) {
        this.repo = repo;
        this.authManager = authManager;
        this.encoder = encoder;
    }

    public User signup(RegisterDto dto) {
        // 1) Optional: check that email isn't already taken
        if (repo.findByEmail(dto.email()).isPresent()) {
            throw new IllegalStateException("Email already in use");
        }

        // 2) Create & save
        var newUser = new Member(
                dto.fullName(),
                dto.email(),
                encoder.encode(dto.password())
        );
        newUser.setEnabled(true);          // or false if you require email verification
        return repo.save(newUser);
    }

    public String login(LoginDto dto, JwtUtil jwtUtil) {
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );

        // principal implements UserDetails (e.g., your Member)
        var principal = (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal();

        return jwtUtil.generateToken(principal);
    }

}

