package com.quickserviceapp.quickserviceapp.Service;

import com.quickserviceapp.quickserviceapp.DTO.UserDto;
import com.quickserviceapp.quickserviceapp.DTO.UserLogInDto;
import com.quickserviceapp.quickserviceapp.DTO.UserSignInDTO;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> checkExisting(UserSignInDTO dto) {
        Map<String, Object> res = new HashMap<>();
        String mail = dto.getMailID() != null ? dto.getMailID().trim() : null;
        String mobile = dto.getMobileNumber() != null ? dto.getMobileNumber().trim() : null;

        boolean byMail = mail != null && userRepository.existsByMailID(mail);
        boolean byMobile = mobile != null && userRepository.existsByMobileNumber(mobile);

        if (byMail || byMobile) {
            res.put("success", true);
            res.put("message", "User Already Existed");
            Optional<User> existing = Optional.empty();
            if (byMail) existing = userRepository.findByMailID(mail);
            else if (byMobile) existing = userRepository.findByMobileNumber(mobile);
            existing.ifPresent(u -> res.put("userId", u.getId()));
        } else {
            res.put("success", false);
            res.put("message", "User Not Existed");
        }
        return res;
    }

    public Map<String, Object> createUser(UserDto dto) {
        Map<String, Object> res = new HashMap<>();
        if (dto == null) {
            res.put("success", false);
            res.put("message", "User data is required");
            return res;
        }
        String mail = dto.getMailID() != null ? dto.getMailID().trim() : null;
        String mobile = dto.getMobileNumber() != null ? dto.getMobileNumber().trim() : null;
        String name = dto.getUserName() != null ? dto.getUserName().trim() : null;
        String password = dto.getPassword() != null ? dto.getPassword() : null;

        if (name == null || name.isEmpty()) { res.put("success", false); res.put("message", "Name is required"); return res; }
        if (mail == null || mail.isEmpty()) { res.put("success", false); res.put("message", "Email (mailID) is required"); return res; }
        if (password == null || password.isEmpty()) { res.put("success", false); res.put("message", "Password is required"); return res; }

        if (mail != null && userRepository.existsByMailID(mail)) { res.put("success", false); res.put("message", "Email already exists"); return res; }
        if (mobile != null && userRepository.existsByMobileNumber(mobile)) { res.put("success", false); res.put("message", "Mobile number already exists"); return res; }

        User user = new User();
        user.setUserName(name);
        user.setMailID(mail);
        user.setPassword(password);
        user.setMobileNumber(mobile);
        user.setDob(dto.getDob());
        user.setAge(dto.getAge());
        user.setCountry(dto.getCountry() == null ? "" : dto.getCountry());
        user.setAddress(dto.getAddress() == null ? "" : dto.getAddress());
        user.setPincode(dto.getPincode() == null ? "" : dto.getPincode());
        user.setDistrict(dto.getDistrict() == null ? "" : dto.getDistrict());
        user.setState(dto.getState() == null ? "" : dto.getState());

        User saved = userRepository.save(user);
        res.put("success", true);
        res.put("message", "User created successfully");
        res.put("userId", saved.getId());
        return res;
    }

    public Map<String, Object> login(UserLogInDto dto) {
        Map<String, Object> res = new HashMap<>();
        String mail = dto.getMailID() != null ? dto.getMailID().trim() : null;

        if (mail == null) 
        { 
            res.put("success", false); res.put("message", "mailID required"); return res; 
        }
        Optional<User> userOpt = userRepository.findByMailID(mail);

        if (userOpt.isEmpty()) 
        { 
            res.put("success", false); 
            res.put("message", "No user found with this email"); return res; 

        }
        User user = userOpt.get();

        if (!user.getPassword().equals(dto.getPassword()))
        {
            res.put("success", false);
            res.put("message", "Invalid password"); 
            return res;
        }
        user.setPassword(null);
        res.put("success", true);
        res.put("message", "Successfully Login");
        res.put("user", user);
        return res;
    }

    public Optional<User> getUserById(Integer id) { return userRepository.findById(id); }

    public Map<String, Object> updateUser(Integer id, UserDto dto) {
        Map<String, Object> res = new HashMap<>();
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) { res.put("success", false); res.put("message", "User not found"); return res; }
        User user = opt.get();

        if (dto.getMailID() != null && !dto.getMailID().equalsIgnoreCase(user.getMailID())) {
            if (userRepository.existsByMailID(dto.getMailID())) { res.put("success", false); res.put("message", "Email already in use"); return res; }
            user.setMailID(dto.getMailID());
        }
        if (dto.getMobileNumber() != null && !dto.getMobileNumber().equals(user.getMobileNumber())) {
            if (userRepository.existsByMobileNumber(dto.getMobileNumber())) { res.put("success", false); res.put("message", "Mobile number already in use"); return res; }
            user.setMobileNumber(dto.getMobileNumber());
        }
        if (dto.getUserName() != null) user.setUserName(dto.getUserName());
        if (dto.getPassword() != null) user.setPassword(dto.getPassword());
        if (dto.getDob() != null) user.setDob(dto.getDob());
        if (dto.getAge() != null) user.setAge(dto.getAge());
        if (dto.getCountry() != null) user.setCountry(dto.getCountry());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getPincode() != null) user.setPincode(dto.getPincode());
        if (dto.getDistrict() != null) user.setDistrict(dto.getDistrict());
        if (dto.getState() != null) user.setState(dto.getState());

        User saved = userRepository.save(user);
        saved.setPassword(null);
        res.put("success", true);
        res.put("message", "Profile updated");
        res.put("user", saved);
        return res;
    }
}
