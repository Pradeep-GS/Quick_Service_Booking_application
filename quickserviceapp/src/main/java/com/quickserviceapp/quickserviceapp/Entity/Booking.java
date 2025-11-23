package com.quickserviceapp.quickserviceapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private ServiceProvider provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private Category service;

    // snapshot user details
    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_address", nullable = false)
    private String userAddress;

    @Column(name = "user_mobile", nullable = false)
    private String userMobile;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "booking_time", nullable = false)
    private LocalTime bookingTime;

    @Column(length = 500)
    private String description;

    // Booking status
    public enum Status {
        PENDING,
        ACCEPTED,
        CANCELLED,
        COMPLETED
    }

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDING','ACCEPTED','CANCELLED','COMPLETED')")
    private Status status = Status.PENDING;

    // Payment status (matches your SQL enum)
    public enum PaymentStatus {
        NOT_PAID,
        PAID
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", columnDefinition = "ENUM('NOT_PAID','PAID')", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.NOT_PAID;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "amount_in_paise")
    private Integer amountInPaise;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
