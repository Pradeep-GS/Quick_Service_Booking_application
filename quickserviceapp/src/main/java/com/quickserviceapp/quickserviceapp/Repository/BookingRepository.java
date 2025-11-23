package com.quickserviceapp.quickserviceapp.Repository;

import com.quickserviceapp.quickserviceapp.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    // User bookings
    List<Booking> findByUser_IdOrderByBookingDateDesc(Integer userId);

    // Provider bookings
    List<Booking> findByProvider_IdOrderByBookingDateDesc(Integer providerId);

    // Provider bookings filtered by status
    List<Booking> findByProvider_IdAndStatusOrderByBookingDateDesc(Integer providerId, Booking.Status status);

    // Counts for dashboard
    long countByProvider_Id(Integer providerId);
    long countByProvider_IdAndStatus(Integer providerId, Booking.Status status);

    // Find booking by the temporary session id or final payment id
    Optional<Booking> findByPaymentId(String paymentId);
}
