package com.quickserviceapp.quickserviceapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponseDTO {
    private Integer id;
    private Integer userId;
    private String userName;
    private String userEmail;
    private Integer providerId;
    private Integer bookingId;
    private Integer ratingValue;
    private String comments;
    private LocalDateTime createdAt;
}