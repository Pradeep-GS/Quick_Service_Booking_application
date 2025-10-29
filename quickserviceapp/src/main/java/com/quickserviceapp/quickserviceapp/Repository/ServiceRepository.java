package com.quickserviceapp.quickserviceapp.Repository;

import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceRepository extends JpaRepository<ServiceProvider, Integer> {
    Optional<ServiceProvider> findByemail(String email);
    Optional<ServiceProvider> findBymobileNumber(String mobileNumber);
}
