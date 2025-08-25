package com.example.LibrarySystem.service.impl;

import com.example.LibrarySystem.dto.UpdateMemberReq;
import com.example.LibrarySystem.exception.ResourceNotFoundException;
import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.model.User;
import com.example.LibrarySystem.repository.UserRepository;
import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.service.MemberService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
        return userRepository.findAllEnabledMembers();
    }

    @Override
    public Member getMemberById(long id) {
        return userRepository.findByIdAndType(id, Member.class)
                .orElseThrow(() -> new ResourceNotFoundException("Member","Id",id));
    }

    @Override
    public void deleteMember(long id) {
        User user = userRepository.findByIdAndType(id, Member.class).orElseThrow(() ->
                new ResourceNotFoundException("Member", "Id", id));
        user.setEnabled(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateMember(long id, UpdateMemberReq req) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found: " + id));

        // minimal updates
        u.setFullName(req.fullName().trim());
        u.setEmail(req.email().trim());

        // if you later add tokenVersion bump etc., do it here

        return userRepository.save(u);
    }
}
