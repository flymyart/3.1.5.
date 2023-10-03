package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.services.SecurityService;

import java.security.Principal;

@Controller
@RequestMapping("/user")
public class UserController {

    private final SecurityService securityService;

    public UserController(SecurityService securityService) {
        this.securityService = securityService;
    }

    @GetMapping()
    public String show(Principal principal, Model model) {
        model.addAttribute("user", securityService.findByUsername(principal.getName()));
        return "user";
    }
}