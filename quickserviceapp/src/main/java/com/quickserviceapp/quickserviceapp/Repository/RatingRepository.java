package com.quickserviceapp.quickserviceapp.Repository;

import com.quickserviceapp.quickserviceapp.Entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Integer> {

    Rating findByBookingId(Integer bookingId);
    List<Rating> findByProviderId(Integer providerId);
}
