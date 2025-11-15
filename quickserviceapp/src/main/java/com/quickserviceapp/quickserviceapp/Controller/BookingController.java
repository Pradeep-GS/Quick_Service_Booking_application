package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.BookingDTO;
import com.quickserviceapp.quickserviceapp.Entity.Booking;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ✅ Create Booking
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            Booking booking = new Booking();

            // Set User
            User user = new User();
            user.setId(bookingDTO.getUserId());
            booking.setUser(user);

            // Set Provider
            ServiceProvider provider = new ServiceProvider();
            provider.setId(bookingDTO.getProviderId());
            booking.setProvider(provider);

            // Set Service
            Category service = new Category();
            service.setId(bookingDTO.getServiceId());
            booking.setService(service);

            // Booking details
            booking.setBookingDate(LocalDate.parse(bookingDTO.getBookingDate()));
            booking.setBookingTime(LocalTime.parse(bookingDTO.getBookingTime()));
            booking.setDescription(bookingDTO.getDescription());
            booking.setStatus(Booking.Status.PENDING);

            Booking saved = bookingService.saveBooking(booking);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error saving booking: " + e.getMessage());
        }
    }

    // ✅ Get bookings by User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable int userId) {
        User user = new User();
        user.setId(userId);
        return ResponseEntity.ok(bookingService.getBookingsByUser(user));
    }

    // ✅ Get bookings by Provider
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Booking>> getProviderBookings(@PathVariable int providerId) {
        ServiceProvider provider = new ServiceProvider();
        provider.setId(providerId);
        return ResponseEntity.ok(bookingService.getBookingsByProvider(provider));
    }

    // ✅ Update booking status (Confirm / Cancel)
    @PutMapping("/status/{id}")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable int id,
            @RequestParam String status
    ) {
        Booking.Status newStatus = Booking.Status.valueOf(status.toUpperCase());
        Booking updated = bookingService.updateStatus(id, newStatus);
        return ResponseEntity.ok(updated);
    }
}
