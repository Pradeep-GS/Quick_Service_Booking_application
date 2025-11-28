package com.quickserviceapp.quickserviceapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rating")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "provider_id", nullable = false)
    private Integer providerId;

    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "rating_value", nullable = false)
    private Integer ratingValue;

    private String comments;

    private LocalDateTime createdAt;
}
