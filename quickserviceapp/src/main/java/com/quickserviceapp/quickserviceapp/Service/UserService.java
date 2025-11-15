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

    /**
     * Check if a user exists by mail or mobile.
     * returns map: { success: boolean, message: String, userId: (optional) }
     */
    public Map<String, Object> checkExisting(UserSignInDTO dto) {
        Map<String, Object> res = new HashMap<>();
        String mail = dto.getMailId() != null ? dto.getMailId().trim() : null;
        String mobile = dto.getMobileNumber() != null ? dto.getMobileNumber().trim() : null;

        boolean byMail = mail != null && userRepository.existsByMailID(mail);
        boolean byMobile = mobile != null && userRepository.existsByMobileNumber(mobile);

        if (byMail || byMobile) {
            res.put("success", true);
            res.put("message", "User Already Existed");
            // include existing user info optionally
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

    /**
     * Create a new user (signup / profile setup final save)
     */
    public Map<String, Object> createUser(UserDto dto) {
        Map<String, Object> res = new HashMap<>();
        String mail = dto.getMailID() != null ? dto.getMailID().trim() : null;
        String mobile = dto.getMobileNumber() != null ? dto.getMobileNumber().trim() : null;

        if (mail != null && userRepository.existsByMailID(mail)) {
            res.put("success", false);
            res.put("message", "Email already exists");
            return res;
        }
        if (mobile != null && userRepository.existsByMobileNumber(mobile)) {
            res.put("success", false);
            res.put("message", "Mobile number already exists");
            return res;
        }

        User user = new User();
        user.setUserName(dto.getUserName());
        user.setMailID(mail);
        user.setPassword(dto.getPassword());
        user.setMobileNumber(mobile);
        user.setDob(dto.getDob());
        user.setAge(dto.getAge());
        user.setCountry(dto.getCountry());
        user.setAddress(dto.getAddress());
        user.setPincode(dto.getPincode());
        user.setDistrict(dto.getDistrict());
        user.setState(dto.getState());

        User saved = userRepository.save(user);
        res.put("success", true);
        res.put("message", "User created successfully");
        res.put("userId", saved.getId());
        return res;
    }

    /**
     * Login
     */
    public Map<String, Object> login(UserLogInDto dto) {
        Map<String, Object> res = new HashMap<>();
        String mail = dto.getMailID() != null ? dto.getMailID().trim() : null;
        if (mail == null) {
            res.put("success", false);
            res.put("message", "mailID required");
            return res;
        }

        Optional<User> userOpt = userRepository.findByMailID(mail);
        if (userOpt.isEmpty()) {
            res.put("success", false);
            res.put("message", "No user found with this email");
            return res;
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(dto.getPassword())) {
            res.put("success", false);
            res.put("message", "Invalid password");
            return res;
        }

        // success -> don't return the password in the response
        user.setPassword(null);
        res.put("success", true);
        res.put("message", "Successfully Login");
        res.put("user", user);
        return res;
    }

    /**
     * Get user by id (for profile page)
     */
    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    /**
     * Update user profile (called from profile page PUT)
     */
    public Map<String, Object> updateUser(int id, UserDto dto) {
        Map<String, Object> res = new HashMap<>();
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            res.put("success", false);
            res.put("message", "User not found");
            return res;
        }
        User user = opt.get();

        // If updating email/mobile, check uniqueness
        if (dto.getMailID() != null && !dto.getMailID().equalsIgnoreCase(user.getMailID())) {
            if (userRepository.existsByMailID(dto.getMailID())) {
                res.put("success", false);
                res.put("message", "Email already in use");
                return res;
            }
            user.setMailID(dto.getMailID());
        }

        if (dto.getMobileNumber() != null && !dto.getMobileNumber().equals(user.getMobileNumber())) {
            if (userRepository.existsByMobileNumber(dto.getMobileNumber())) {
                res.put("success", false);
                res.put("message", "Mobile number already in use");
                return res;
            }
            user.setMobileNumber(dto.getMobileNumber());
        }

        // update other allowed fields
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
        saved.setPassword(null); // hide password in response
        res.put("success", true);
        res.put("message", "Profile updated");
        res.put("user", saved);
        return res;
    }
}
