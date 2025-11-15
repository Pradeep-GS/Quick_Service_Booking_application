package com.quickserviceapp.quickserviceapp.Service;
import com.quickserviceapp.quickserviceapp.Entity.Booking;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;




@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(User user) {
        return bookingRepository.findByUser(user);
    }

    public List<Booking> getBookingsByProvider(ServiceProvider provider) {
        return bookingRepository.findByProvider(provider);
    }

    public Optional<Booking> getBookingById(int id) {
        return bookingRepository.findById(id);
    }

    public Booking updateStatus(int bookingId, Booking.Status status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        return null;
    }
}
