package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.BookingDTO;
import com.quickserviceapp.quickserviceapp.DTO.BookingResponseDTO;
import com.quickserviceapp.quickserviceapp.Service.BookingService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO dto) {
        try {
            var saved = bookingService.createBooking(dto);
            var resp = bookingService.toResponseDTO(saved);
            return ResponseEntity.ok(resp);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @PutMapping("/provider/action/{bookingId}")
    public ResponseEntity<?> providerAction(@PathVariable Integer bookingId, @RequestParam String action) {
        try {
            var updated = bookingService.updateBookingByProvider(bookingId, action);
            return ResponseEntity.ok(bookingService.toResponseDTO(updated));
        } catch (RuntimeException rex) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", rex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings(@PathVariable Integer userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserIdDTO(userId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponseDTO>> getProviderBookings(@PathVariable Integer providerId) {
        return ResponseEntity.ok(bookingService.getBookingsByProviderIdDTO(providerId));
    }

    // Create checkout session (optional - equivalent to /stripe/create-checkout-session)
    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestParam Integer bookingId) {
        try {
            Session session = bookingService.createCheckoutSessionForBooking(bookingId);
            return ResponseEntity.ok(Map.of("url", session.getUrl(), "id", session.getId()));
        } catch (StripeException se) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", se.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @PutMapping("/update-payment")
    public ResponseEntity<?> updatePaymentStatus(@RequestParam String sessionId,
                                                 @RequestParam(required = false) String paymentId) {
        try {
            bookingService.markPaymentDoneFromStripeSession(sessionId, paymentId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment recorded"));
        } catch (RuntimeException rex) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", rex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", ex.getMessage()));
        }
    }
}
