package com.quickserviceapp.quickserviceapp.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "chat_message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sender_id", nullable = false)
    private Integer senderId;

    @Column(name = "receiver_id", nullable = false)
    private Integer receiverId;

    @Column(name = "sender_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private SenderType senderType;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private Instant timestamp;

    @PrePersist
    public void prePersist() {
        this.timestamp = Instant.now();
    }

    public enum SenderType {
        USER, PROVIDER
    }
}

