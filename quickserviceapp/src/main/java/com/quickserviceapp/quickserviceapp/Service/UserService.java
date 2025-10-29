package com.quickserviceapp.quickserviceapp.Service;

import com.quickserviceapp.quickserviceapp.DTO.UserDto;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    public boolean createUser(UserDto dto) {
        if(isexist(dto.getMailID(), dto.getMobileNumber())) {
            return false;
        }
        User user = new User();
        user.setUser_name(dto.getUserName());
        user.setmailId(dto.getMailID());
        user.setPASSWORD(dto.getPassword());
        user.setMOBILE_NUMBER(dto.getMobileNumber());
        user.setDOB(dto.getDob());
        user.setAGE(dto.getAge());
        user.setCOUNTRY(dto.getCountry());
        user.setADDRESS(dto.getAddress());
        user.setPINCODE(dto.getPincode());
        user.setDISTRICT(dto.getDistrict());
        user.setSTATE(dto.getState());
        userRepo.save(user);
        return true;
    }
    public boolean isexist(String mailId,String mobileNumber)
    {
        return userRepo.findByMailId(mailId).isPresent() || userRepo.findBymobileNumber(mobileNumber).isPresent();
    }
    public boolean login(String mailId,String password)
    {
        Optional<User> useropt = userRepo.findByMailId(mailId);

        if(useropt.isPresent())
        {
            User user = useropt.get();
            return user.getPASSWORD().equals(password);
        }
        return false;
    }
}
