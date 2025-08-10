package com.example.LibrarySystem.service.impl;

import com.example.LibrarySystem.exception.ResourceNotFoundException;
import com.example.LibrarySystem.model.User;
import com.example.LibrarySystem.repository.UserRepository;
import com.example.LibrarySystem.model.User;
import com.example.LibrarySystem.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User addUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(long id) {
        return userRepository.findByIdAndType(id, User.class)
                .orElseThrow(() -> new ResourceNotFoundException("User","Id",id));
    }

    @Override
    public void deleteUser(long id) {
        userRepository.findByIdAndType(id, User.class).orElseThrow(() ->
                new ResourceNotFoundException("User", "Id", id));
        userRepository.deleteById(id);
    }

    @Override
    public User updateUser(User user, long id) {
        User existingUser = userRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("User", "Id", id));

        existingUser.setFullName(user.getFullName());
        existingUser.setEmail(user.getEmail());

        userRepository.save(existingUser);
        return existingUser;
    }
}
