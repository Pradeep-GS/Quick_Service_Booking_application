package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.RatingDTO;
import com.quickserviceapp.quickserviceapp.DTO.RatingResponseDTO;
import com.quickserviceapp.quickserviceapp.Entity.Rating;
import com.quickserviceapp.quickserviceapp.Service.RatingService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rating")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/add")
    public ResponseEntity<?> addRating(@RequestBody RatingDTO dto) {
        Rating rating = ratingService.addRating(dto);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<?> getRatings(@PathVariable int providerId) {
        List<RatingResponseDTO> ratings = ratingService.getRatingsByProvider(providerId);
        return ResponseEntity.ok(ratings);
    }


    @PostMapping("/send-email/session")
    public ResponseEntity<?> sendRatingEmailBySession(@RequestParam String sessionId) {
        try {
            ratingService.sendRatingEmailBySession(sessionId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Rating email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/send-email/booking")
    public ResponseEntity<?> sendRatingEmailByBooking(@RequestParam Integer bookingId) {
        try {
            ratingService.sendRatingEmailByBooking(bookingId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Rating email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}