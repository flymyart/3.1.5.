package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.services.SecurityService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleServiceImpl roleService;
    private final SecurityService securityService;

    public AdminController(UserService userService, RoleServiceImpl roleService, SecurityService securityService) {
        this.userService = userService;
        this.roleService = roleService;
        this.securityService = securityService;
    }

    @GetMapping()
    public String admin(@ModelAttribute ("user") User user, Principal principal, Model model) {
        User authenticatedUser = securityService.findByUsername(principal.getName());
        model.addAttribute("users", userService.listUsers());
        model.addAttribute("authenticatedUser", authenticatedUser);
        model.addAttribute("roleOfAuthenticatedUser", authenticatedUser.getRoles());
        model.addAttribute("allRoles", roleService.findAll());
        return "admin";
    }

    @PostMapping("/create")
    public String create(@ModelAttribute("newUser") User user) {
        userService.save(user);
        return "redirect:/admin";
    }

    @PatchMapping("/edit/{id}")
    public String update(@ModelAttribute("user") User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "edit";
        }
        userService.update(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") int id) {
        userService.delete(id);
        return "redirect:/admin";
    }
}