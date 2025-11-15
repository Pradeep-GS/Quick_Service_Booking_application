package com.quickserviceapp.quickserviceapp.Repository;
import com.quickserviceapp.quickserviceapp.Entity.Booking;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUser(User user);
    List<Booking> findByProvider(ServiceProvider provider);
}