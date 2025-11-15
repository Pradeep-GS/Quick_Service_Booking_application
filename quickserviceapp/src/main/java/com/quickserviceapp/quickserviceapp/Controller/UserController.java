package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.UserDto;
import com.quickserviceapp.quickserviceapp.DTO.UserLogInDto;
import com.quickserviceapp.quickserviceapp.DTO.UserSignInDTO;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173") // adjust your React origin if different
public class UserController {

    @Autowired
    private UserService userService;

    // 1) check existence by email/mobile before final signup (frontend: sign-in page)
    @PostMapping("/search")
    public ResponseEntity<Map<String, Object>> checkExisting(@RequestBody UserSignInDTO dto) {
        Map<String, Object> result = userService.checkExisting(dto);
        return ResponseEntity.ok(result);
    }

    // 2) create user (profile setup final save)
    @PostMapping("/createuser")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody UserDto dto) {
        Map<String, Object> result = userService.createUser(dto);
        return ResponseEntity.ok(result);
    }

    // 3) login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserLogInDto dto) {
        Map<String, Object> result = userService.login(dto);
        return ResponseEntity.ok(result);
    }

    // 4) get user by id (for profile page hydrate)
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable int id) {
        Optional<User> opt = userService.getUserById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "User not found"));
        }
        User user = opt.get();
        user.setPassword(null);
        return ResponseEntity.ok(Map.of("success", true, "user", user));
    }

    // 5) update user profile (PUT)
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable int id, @RequestBody UserDto dto) {
        Map<String, Object> result = userService.updateUser(id, dto);
        return ResponseEntity.ok(result);
    }
}
