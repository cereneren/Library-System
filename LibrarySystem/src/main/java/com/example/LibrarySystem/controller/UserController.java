package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.model.User;
import com.example.LibrarySystem.service.UserService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // build create user REST API
    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        return new ResponseEntity<User>(userService.addUser(user), HttpStatus.CREATED);
    }

    // build get all users REST API
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // build get user by id REST API
    // http://localhost:8080/api/user/1
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id) {
        return new ResponseEntity<User>(userService.getUserById(id), HttpStatus.OK);
    }

    // build delete user REST API
    // http://localhost:8080/api/user/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id) {
        userService.deleteUser(id);
        return new ResponseEntity<String>("User deleted succesfully.", HttpStatus.OK);
    }

    // build update user REST API
    // http://localhost:8080/api/users/1
    @JsonIgnoreProperties(ignoreUnknown = true)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") long userId, @RequestBody User user) {
        return new ResponseEntity<User>(userService.updateUser(user, userId), HttpStatus.OK);
    }
}
