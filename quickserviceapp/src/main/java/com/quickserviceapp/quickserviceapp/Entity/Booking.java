package com.quickserviceapp.quickserviceapp.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "booking")
@Getter
@Setter
@NoArgsConstructor
public class Booking {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Relations
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private ServiceProvider provider;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Category service;

    // Booking details
    private LocalDate bookingDate;
    private LocalTime bookingTime;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private LocalDate createdAt = LocalDate.now();

    public enum Status {
        PENDING,
        CONFIRMED,
        CANCELLED
    }
}

