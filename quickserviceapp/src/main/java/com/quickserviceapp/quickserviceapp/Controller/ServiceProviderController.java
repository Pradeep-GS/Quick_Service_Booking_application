package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.ProviderDTO;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Service.ServiceProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/service")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceProviderController {

    @Autowired
    private ServiceProviderService serviceProviderService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String,Object>> signup(@RequestBody ProviderDTO dto) {
        Map<String,Object> res = new HashMap<>();
        try {
            ServiceProvider saved = serviceProviderService.registerProvider(dto);
            res.put("success", true);
            res.put("message", "User created successfully");
            res.put("providerId", saved.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (RuntimeException ex) {
            res.put("success", false);
            res.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        } catch (Exception ex) {
            ex.printStackTrace();
            res.put("success", false);
            res.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @PostMapping("/check")
public ResponseEntity<Map<String, Object>> check(@RequestBody Map<String, String> payload) {
    String email = payload.get("email");
    String mobileNumber = payload.get("mobileNumber");

    Map<String, Object> res = new HashMap<>();

    if (email == null || mobileNumber == null) {
        res.put("success", false);
        res.put("message", "Email and Mobile Number are required");
        return ResponseEntity.badRequest().body(res);
    }

    boolean exists = serviceProviderService.isExist(email, mobileNumber);
    res.put("success", exists);
    res.put("message", exists ? "User Already Exists" : "User Not Exists");

    return ResponseEntity.ok(res);
}


    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@RequestBody Map<String,String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        Map<String,Object> res = new HashMap<>();
        Optional<ServiceProvider> opt = serviceProviderService.validateProvider(email, password);
        if (opt.isPresent()) {
            res.put("success", true);
            res.put("message", "Successfully Login");
            res.put("provider", opt.get());
        } else {
            res.put("success", false);
            res.put("message", "Invalid email or password");
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/getcat")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = serviceProviderService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/getproviders")
    public ResponseEntity<List<ServiceProvider>> getProviders() {
        List<ServiceProvider> list = serviceProviderService.getAllProviders();
        return ResponseEntity.ok(list);
    }
      @GetMapping("/provider/{id}")
    public ResponseEntity<?> getProviderById(@PathVariable int id) {
        ServiceProvider provider = serviceProviderService.getProviderById(id);
        return ResponseEntity.ok(provider);
    }
}