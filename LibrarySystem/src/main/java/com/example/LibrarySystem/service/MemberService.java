package com.example.LibrarySystem.service;

import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.model.User;

import java.util.List;

public interface MemberService {
    Member addMember(Member member);
    List<Member> getAllMembers();
    Member getMemberById(long id);
    void deleteMember(long id);
    Member updateMember(Member member, long id);
}
