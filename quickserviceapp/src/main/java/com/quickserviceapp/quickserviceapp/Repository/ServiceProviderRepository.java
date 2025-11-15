package com.quickserviceapp.quickserviceapp.Repository;

import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Integer> {

    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);

    // ✅ Add this line
    boolean existsByEmailOrMobileNumber(String email, String mobileNumber);

    Optional<ServiceProvider> findByEmail(String email);
    Optional<ServiceProvider> findByEmailAndPassword(String email, String password);
}
