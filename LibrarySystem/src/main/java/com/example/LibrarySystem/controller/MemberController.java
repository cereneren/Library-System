package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.jwt.JwtUtil;
import com.example.LibrarySystem.model.Loan;
import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.service.LoanService;
import com.example.LibrarySystem.service.MemberService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    private MemberService memberService;
    private LoanService loanService;
    private JwtUtil jwtUtil;

    public MemberController(MemberService memberService, LoanService loanService, JwtUtil jwtUtil) {
        this.memberService = memberService;
        this.loanService = loanService;
        this.jwtUtil = jwtUtil;
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

    // build update member REST API
    // http://localhost:8080/api/members/1
    @JsonIgnoreProperties(ignoreUnknown = true)
    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable("id") long memberId, @RequestBody Member member) {
        Member updated = memberService.updateMember(member, memberId);
        String newJwt = jwtUtil.generateToken(updated); // still using email inside for now

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + newJwt)
                .body(updated);
    }


    @GetMapping("/{id}/loans")
    public ResponseEntity<List<Loan>> getMemberLoans(@PathVariable("id") long memberId) {
        List<Loan> loans = loanService.getLoansByMemberId(memberId);
        return ResponseEntity.ok(loans);
    }

}
