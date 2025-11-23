package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.UserDto;
import com.quickserviceapp.quickserviceapp.DTO.UserLogInDto;
import com.quickserviceapp.quickserviceapp.DTO.UserSignInDTO;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/search")
    public ResponseEntity<Map<String, Object>> checkExisting(@RequestBody UserSignInDTO dto) {
        Map<String, Object> result = userService.checkExisting(dto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/createuser")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody UserDto dto) {
        Map<String, Object> result = new HashMap<>();


        if (dto == null) {
            result.put("success", false);
            result.put("message", "Request body is required");
            return ResponseEntity.badRequest().body(result);
        }
        if (dto.getUserName() == null || dto.getUserName().trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "userName is required");
            return ResponseEntity.badRequest().body(result);
        }
        if (dto.getMailID() == null || dto.getMailID().trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "mailID is required");
            return ResponseEntity.badRequest().body(result);
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "password is required");
            return ResponseEntity.badRequest().body(result);
        }

        try {
            Map<String, Object> serviceResult = userService.createUser(dto);
            Boolean ok = (Boolean) serviceResult.getOrDefault("success", false);

            if (ok) {
                return ResponseEntity.status(HttpStatus.CREATED).body(serviceResult);
            } else {
                String msg = (String) serviceResult.getOrDefault("message", "User creation failed");
                if (msg.toLowerCase().contains("already")) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(serviceResult);
                }
                return ResponseEntity.badRequest().body(serviceResult);
            }
        } catch (DataIntegrityViolationException dive) {
            result.put("success", false);
            result.put("message", "Database constraint error: " + dive.getMostSpecificCause().getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
        } catch (Exception ex) {
            ex.printStackTrace();
            result.put("success", false);
            result.put("message", "Internal server error: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserLogInDto dto) {
        Map<String, Object> result = userService.login(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable int id) {
        Optional<User> opt = userService.getUserById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("success", false, "message", "User not found"));
        }
        User user = opt.get();
        return ResponseEntity.ok(Map.of("success", true, "user", user));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable int id, @RequestBody UserDto dto) {
        Map<String, Object> result = userService.updateUser(id, dto);
        return ResponseEntity.ok(result);
    }
}
