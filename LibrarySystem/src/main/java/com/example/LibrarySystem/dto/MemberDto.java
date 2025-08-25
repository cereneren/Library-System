package com.example.LibrarySystem.dto;


import com.example.LibrarySystem.model.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.List;
import java.util.stream.Collectors;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MemberDto(
        Long id,
        String fullName,
        String email,
        List<String> roles,
        boolean enabled,
        @JsonFormat(shape = JsonFormat.Shape.STRING) java.time.LocalDateTime createdAt,
        @JsonFormat(shape = JsonFormat.Shape.STRING) java.time.LocalDateTime updatedAt
) {
    public static MemberDto from(User u) {
        List<String> roleNames = u.getAuthorities()
                .stream().map(a -> a.getAuthority()).collect(Collectors.toList());

        return new MemberDto(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                roleNames,
                u.isEnabled(),
                u.getDateCreated(),   // null-safe; include only if you have these fields
                u.getDateUpdated()
        );
    }
}
