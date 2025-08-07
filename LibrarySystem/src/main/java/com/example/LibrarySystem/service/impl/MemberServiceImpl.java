package com.example.LibrarySystem.service.impl;

import com.example.LibrarySystem.exception.ResourceNotFoundException;
import com.example.LibrarySystem.repository.UserRepository;
import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.service.MemberService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberServiceImpl implements MemberService {
    private final UserRepository userRepository;

    public MemberServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Member addMember(Member member) {
        return userRepository.save(member);
    }

    @Override
    public List<Member> getAllMembers() {
        return userRepository.findAllByType(Member.class);
    }

    @Override
    public Member getMemberById(long id) {
        return userRepository.findByIdAndType(id, Member.class)
                .orElseThrow(() -> new ResourceNotFoundException("Member","Id",id));
    }

    @Override
    public void deleteMember(long id) {
        userRepository.findByIdAndType(id, Member.class).orElseThrow(() ->
                new ResourceNotFoundException("Member", "Id", id));
        userRepository.deleteById(id);
    }
}
