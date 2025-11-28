package com.quickserviceapp.quickserviceapp.Service;

import com.quickserviceapp.quickserviceapp.DTO.RatingDTO;
import com.quickserviceapp.quickserviceapp.DTO.RatingResponseDTO;
import com.quickserviceapp.quickserviceapp.Entity.Booking;
import com.quickserviceapp.quickserviceapp.Entity.Rating;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Repository.BookingRepository;
import com.quickserviceapp.quickserviceapp.Repository.RatingRepository;
import com.quickserviceapp.quickserviceapp.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    @Autowired UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final BookingRepository bookingRepository;
    private final JavaMailSender mailSender;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public Rating addRating(RatingDTO dto) {
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (ratingRepository.findByBookingId(dto.getBookingId()) != null) {
            throw new RuntimeException("Rating already submitted for this booking");
        }

        Rating rating = Rating.builder()
                .userId(booking.getUser().getId())
                .providerId(booking.getProvider().getId())
                .bookingId(booking.getId())
                .ratingValue(dto.getRating())
                .comments(dto.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        return ratingRepository.save(rating);
    }

    public List<RatingResponseDTO> getRatingsByProvider(int providerId) {
            List<Rating> ratings = ratingRepository.findByProviderId(providerId);
            
            return ratings.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
    }
    
        private RatingResponseDTO convertToResponseDTO(Rating rating) {
        try {
            // Fetch user details
            User user = userRepository.findById(rating.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + rating.getUserId()));

            return RatingResponseDTO.builder()
                    .id(rating.getId())
                    .userId(rating.getUserId())
                    .userName(user.getUserName()) // Add user name
                    .providerId(rating.getProviderId())
                    .bookingId(rating.getBookingId())
                    .ratingValue(rating.getRatingValue())
                    .comments(rating.getComments())
                    .createdAt(rating.getCreatedAt())
                    .build();
        } catch (Exception e) {
            // If user not found, return rating without user details
            return RatingResponseDTO.builder()
                    .id(rating.getId())
                    .userId(rating.getUserId())
                    .userName("Unknown User")
                    .providerId(rating.getProviderId())
                    .bookingId(rating.getBookingId())
                    .ratingValue(rating.getRatingValue())
                    .comments(rating.getComments())
                    .createdAt(rating.getCreatedAt())
                    .build();
        }
    }

    public void sendRatingEmailBySession(String sessionId) {
        try {
            // Find booking by session ID
            Booking booking = bookingRepository.findByPaymentId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Booking not found for session: " + sessionId));
            
            String email = booking.getUser().getMailID();
            Integer bookingId = booking.getId();
            String link = frontendUrl + "/rate/" + bookingId;

            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("Rate Your Service Experience - QuickService");
            msg.setText(
                    "Thank you for using QuickService!\n\n" +
                    "We hope you were satisfied with the service provided.\n\n" +
                    "Please take a moment to rate your experience by clicking the link below:\n" +
                    link + "\n\n" +
                    "Your feedback helps us improve our service quality.\n\n" +
                    "Best regards,\n" +
                    "QuickService Team"
            );

            mailSender.send(msg);
            System.out.println("Rating email sent to: " + email + " for booking: " + bookingId);
            
        } catch (Exception e) {
            System.err.println("Error sending rating email: " + e.getMessage());
            throw new RuntimeException("Failed to send rating email", e);
        }
    }

    public void sendRatingEmailByBooking(Integer bookingId) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            String email = booking.getUser().getMailID();
            String link = frontendUrl + "/rate/" + bookingId;

            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("Rate Your Service Experience - QuickService");
            msg.setText(
                    "Thank you for using QuickService!\n\n" +
                    "We hope you were satisfied with the service provided.\n\n" +
                    "Please take a moment to rate your experience by clicking the link below:\n" +
                    link + "\n\n" +
                    "Your feedback helps us improve our service quality.\n\n" +
                    "Best regards,\n" +
                    "QuickService Team"
            );

            mailSender.send(msg);
            System.out.println("Rating email sent to: " + email + " for booking: " + bookingId);
            
        } catch (Exception e) {
            System.err.println("Error sending rating email: " + e.getMessage());
            throw new RuntimeException("Failed to send rating email", e);
        }
    }
}