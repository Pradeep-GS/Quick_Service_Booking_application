package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.ProviderDTO;
import com.quickserviceapp.quickserviceapp.DTO.BookingResponseDTO;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Service.ServiceProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/service")
@CrossOrigin(origins = "http://localhost:5174")
public class ServiceProviderController {

    @Autowired
    private ServiceProviderService serviceProviderService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String,Object>> signup(@RequestBody ProviderDTO dto) {
        Map<String,Object> res = new HashMap<>();
        try {
            ServiceProvider saved = serviceProviderService.registerProvider(dto);
            res.put("success", true);
            res.put("message", "Provider created successfully");
            res.put("providerId", saved.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (RuntimeException ex) {
            res.put("success", false);
            res.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        } catch (Exception ex) {
            res.put("success", false);
            res.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@RequestBody Map<String,String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        Map<String,Object> res = new HashMap<>();
        if(email == null || password == null){
            res.put("success", false);
            res.put("message","Email and Password are required");
            return ResponseEntity.badRequest().body(res);
        }

        Optional<ServiceProvider> opt = serviceProviderService.validateProvider(email,password);
        if(opt.isPresent()){
            res.put("success", true);
            res.put("message","Successfully logged in");
            res.put("provider", opt.get());
        } else {
            res.put("success", false);
            res.put("message","Invalid email or password");
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/check")
    public ResponseEntity<Map<String,Object>> checkUserExistence(@RequestBody Map<String,String> payload){
        String email = payload.get("email");
        Map<String,Object> res = new HashMap<>();
        if(email == null || email.isEmpty()){
            res.put("success", false);
            res.put("message", "Email is required");
            return ResponseEntity.badRequest().body(res);
        }
        boolean exists = serviceProviderService.isExist(email, null);
        res.put("success", exists);
        res.put("message", exists ? "User exists" : "User does not exist");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/getcat")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(serviceProviderService.getAllCategories());
    }

    @GetMapping("/getproviders")
    public ResponseEntity<List<ServiceProvider>> getProviders() {
        return ResponseEntity.ok(serviceProviderService.getAllProviders());
    }

    @GetMapping("/provider/{id}")
    public ResponseEntity<Map<String,Object>> getProviderById(@PathVariable int id) {
        Map<String,Object> res = new HashMap<>();
        try {
            ServiceProvider provider = serviceProviderService.getProviderById(id);
            res.put("success", true);
            res.put("provider", provider);
            return ResponseEntity.ok(res);
        } catch(RuntimeException ex){
            res.put("success", false);
            res.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }

    @PutMapping("/provider/{id}/update")
    public ResponseEntity<?> updateProviderProfile(@PathVariable int id, @RequestBody ProviderDTO dto){
        try {
            ServiceProvider updated = serviceProviderService.updateProvider(id, dto);
            return ResponseEntity.ok(updated);
        } catch(RuntimeException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", ex.getMessage()));
        }
    }
    @GetMapping("/provider/{id}/dashboard")
    public ResponseEntity<Map<String, Long>> getProviderDashboardStats(@PathVariable int id) {
        Map<String, Long> stats = serviceProviderService.getProviderDashboardStats(id);
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/provider/{id}/notifications")
    public ResponseEntity<List<BookingResponseDTO>> getProviderNotifications(@PathVariable int id) {
        List<BookingResponseDTO> notifications = serviceProviderService.getProviderNotifications(id);
        return ResponseEntity.ok(notifications);
    }
    @GetMapping("/provider/{id}/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getProviderBookingHistory(@PathVariable int id) {
        List<BookingResponseDTO> bookings = serviceProviderService.getProviderBookingHistory(id);
        return ResponseEntity.ok(bookings);
    }
}
