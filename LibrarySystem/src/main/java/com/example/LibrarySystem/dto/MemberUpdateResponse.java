package com.example.LibrarySystem.dto;

import com.example.LibrarySystem.model.Member;

public record MemberUpdateResponse(Member member, String jwt) {}