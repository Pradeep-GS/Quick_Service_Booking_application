package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.Service.StripeService;
import com.quickserviceapp.quickserviceapp.Service.BookingService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/stripe")
@CrossOrigin(origins = "*")
public class StripeController {

    @Autowired private StripeService stripeService;
    @Autowired private BookingService bookingService;

    @PostMapping("/create-checkout-session/{bookingId}")
    public ResponseEntity<?> createCheckoutSession(@PathVariable Integer bookingId) {
        try {
            Session session = bookingService.createCheckoutSessionForBooking(bookingId);
            return ResponseEntity.ok(Map.of("id", session.getId(), "url", session.getUrl()));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestHeader(name = "Stripe-Signature", required = false) String sigHeader,
            @RequestBody String payload) {

        try {
            Event event = stripeService.constructEvent(payload, sigHeader);
            String eventType = event.getType();

            if ("checkout.session.completed".equals(eventType)) {
                // extract session - safe parsing
                Object dataObj = event.getDataObjectDeserializer().getObject().orElse(null);
                if (dataObj instanceof Session) {
                    Session session = (Session) dataObj;
                    String sessionId = session.getId();
                    String paymentIntentId = session.getPaymentIntent();
                    bookingService.markPaymentDoneFromStripeSession(sessionId, paymentIntentId);
                } else {
                    // fallback: if event data is raw map
                    // try to safely parse fields via metadata if needed
                }
            }

            return ResponseEntity.ok("OK");
        } catch (SignatureVerificationException sve) {
            return ResponseEntity.status(400).body("Signature verification failed: " + sve.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Webhook processing error: " + ex.getMessage());
        }
    }
}
