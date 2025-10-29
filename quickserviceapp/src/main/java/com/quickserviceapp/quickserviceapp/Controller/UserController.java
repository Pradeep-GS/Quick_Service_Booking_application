package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.UserDto;
import com.quickserviceapp.quickserviceapp.DTO.UserSigInDTO;
import com.quickserviceapp.quickserviceapp.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/createuser")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody UserDto dto)
    {
        Map<String, Object> response = new HashMap<>();

        boolean created = userService.createUser(dto);

        if (created) {
            response.put("success", true);
            response.put("message", "User created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            response.put("success", false);
            response.put("message", "User already exists or signup failed");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/search")
    public ResponseEntity<Map<String, Object>> checksignin(@RequestBody UserSigInDTO dto)
    {
        boolean result =  userService.isexist(dto.getMailId(), dto.getMobileNumber());

        Map<String, Object> map = new HashMap<>();

        if(result)
        {
            map.put("success",true);
            map.put("message", "User Already Existed");

            return  ResponseEntity.status(HttpStatus.CREATED).body(map);
        }
        else {
            map.put("success",false);
            map.put("message", "User Not Existed");
            return  ResponseEntity.status(HttpStatus.CREATED).body(map);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserDto dto)
    {
        boolean result =  userService.login(dto.getMailID() , dto.getPassword());

        Map<String, Object> map = new HashMap<>();

        if(result)
        {
            map.put("success",true);
            map.put("message", "Successfully Login");

            return  ResponseEntity.status(HttpStatus.CREATED).body(map);
        }
        else {
            map.put("success",false);
            map.put("message", "New User Goto SignIn");
            return  ResponseEntity.status(HttpStatus.CREATED).body(map);
        }
    }

}
