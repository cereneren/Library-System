package com.example.LibrarySystem.service;

import com.example.LibrarySystem.model.User;

import java.util.List;

public interface UserService {
    User addUser(User user);
    List<User> getAllUsers();
    User getUserById(long id);
    void deleteUser(long id);
    User updateUser(User user, long id);
}
