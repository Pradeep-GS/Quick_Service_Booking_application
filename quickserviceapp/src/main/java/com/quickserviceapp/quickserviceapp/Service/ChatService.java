package com.quickserviceapp.quickserviceapp.Service;
import com.quickserviceapp.quickserviceapp.DTO.ChatMessageDTO;
import com.quickserviceapp.quickserviceapp.Entity.ChatMessage;
import com.quickserviceapp.quickserviceapp.Repository.ChatMessageRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository repo;

    public ChatService(ChatMessageRepository repo) {
        this.repo = repo;
    }

    public ChatMessage saveMessage(ChatMessage msg) {
        return repo.save(msg);
    }

    public List<ChatMessageDTO> getConversation(Integer userId, Integer providerId) {
        List<ChatMessage> list = repo.findConversationBetween(userId, providerId);
        return list.stream().map(m -> ChatMessageDTO.builder()
                .id(m.getId())
                .senderId(m.getSenderId())
                .receiverId(m.getReceiverId())
                .senderType(m.getSenderType().name())
                .message(m.getMessage())
                .timestamp(m.getTimestamp().toString())
                .build()).collect(Collectors.toList());
    }
}
