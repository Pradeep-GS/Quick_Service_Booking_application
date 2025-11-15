package com.quickserviceapp.quickserviceapp.Repository;

import com.quickserviceapp.quickserviceapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByMailID(String mailID);
    Optional<User> findByMobileNumber(String mobileNumber);
    boolean existsByMailID(String mailID);
    boolean existsByMobileNumber(String mobileNumber);
}


//to: springmentor166@gmail.com and cc: noor.mohammed@iiht.com
//