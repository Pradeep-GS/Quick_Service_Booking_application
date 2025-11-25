package com.quickserviceapp.quickserviceapp.Repository;
import com.quickserviceapp.quickserviceapp.Entity.ChatMessage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    @Query("SELECT m FROM ChatMessage m WHERE (m.senderId = :userId AND m.receiverId = :providerId) OR (m.senderId = :providerId AND m.receiverId = :userId) ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversationBetween(Integer userId, Integer providerId);
}
