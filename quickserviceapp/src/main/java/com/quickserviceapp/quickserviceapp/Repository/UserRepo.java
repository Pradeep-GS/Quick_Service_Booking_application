package com.quickserviceapp.quickserviceapp.Repository;

import com.quickserviceapp.quickserviceapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {
    Optional<User> findByMailId(String mailId);
    Optional<User> findBymobileNumber(String mobileNumber);

}


//to: springmentor166@gmail.com and cc: noor.mohammed@iiht.com
//