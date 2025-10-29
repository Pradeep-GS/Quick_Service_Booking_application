package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.ProviderDTO;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Service.ServiceProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/service")
public class ServiceProviderController {
    @Autowired
    ServiceProviderService serviceProviderService;

    @PostMapping("/sigup")
    public ResponseEntity<Map<String, Object>>signup(@RequestBody ProviderDTO dto)
    {
        Map<String, Object> response = new HashMap<>();
       boolean res =  serviceProviderService.CreateProvider(dto);
        if (res) {
            response.put("success", true);
            response.put("message", "User created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            response.put("success", false);
            response.put("message", "User already exists or signup failed");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> check(@RequestBody ProviderDTO dto)
    {
        boolean result= serviceProviderService.isexist(dto.getEmail(), dto.getMobileNumber());
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
    public ResponseEntity<Map<String, Object>> login(@RequestBody ProviderDTO dto)
    {
        boolean result =serviceProviderService.login(dto.getEmail(), dto.getPassword());
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
    @GetMapping("/getcat")
    public List<Category> getdata()
    {
        return serviceProviderService.getAllCategories();
    }
}
