package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.CategoryDTO;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {
        return adminService.getDashboardStats();
    }

    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable int id) {
        return adminService.deleteUser(id)
                ? "User removed successfully"
                : "User not found";
    }

    @DeleteMapping("/provider/{id}")
    public String deleteProvider(@PathVariable int id) {
        return adminService.deleteProvider(id)
                ? "Provider removed successfully"
                : "Provider not found";
    }

    @PostMapping("/category")
    public String addCategory(@RequestBody CategoryDTO dto) {
        adminService.addCategory(dto);
        return "Category added successfully!";
    }
    @GetMapping("/users")
    public List<User> getUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/providers")
    public List<ServiceProvider> getProviders() {
        return adminService.getAllProviders();
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return adminService.getAllCategories();
    }

    @DeleteMapping("/category/{id}")
    public String deleteCategory(@PathVariable int id) {
        return adminService.deleteCategory(id)
                ? "Category deleted"
                : "Not found";
    }

}
