package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    private MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // build create member REST API
    @PostMapping
    public ResponseEntity<Member> addMember(@RequestBody Member member) {
        return new ResponseEntity<Member>(memberService.addMember(member), HttpStatus.CREATED);
    }

    // build get all members REST API
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // build get member by id REST API
    // http://localhost:8080/api/member/1
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable("id") long id) {
        return new ResponseEntity<Member>(memberService.getMemberById(id), HttpStatus.OK);
    }

    // build delete member REST API
    // http://localhost:8080/api/member/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable("id") long id) {
        memberService.deleteMember(id);
        return new ResponseEntity<String>("Member deleted succesfully.", HttpStatus.OK);
    }
}
