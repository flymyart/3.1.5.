package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {

    void save(User user);

    void update(User updatedUser);

    void delete(int id);

    User show(Integer id);

    List<User> listUsers();
}