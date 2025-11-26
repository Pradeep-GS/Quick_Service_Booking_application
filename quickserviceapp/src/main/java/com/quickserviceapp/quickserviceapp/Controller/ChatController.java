package com.quickserviceapp.quickserviceapp.Controller;

import com.quickserviceapp.quickserviceapp.DTO.ChatMessageDTO;
import com.quickserviceapp.quickserviceapp.Entity.ChatMessage;
import com.quickserviceapp.quickserviceapp.Service.ChatService;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService service;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService service, SimpMessagingTemplate messagingTemplate) {
        this.service = service;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessageRest(@RequestBody ChatMessageDTO dto) {
        ChatMessage msg = ChatMessage.builder()
                .senderId(dto.getSenderId())
                .receiverId(dto.getReceiverId())
                .senderType(ChatMessage.SenderType.valueOf(dto.getSenderType()))
                .message(dto.getMessage())
                .build();

        ChatMessage saved = service.saveMessage(msg);
        ChatMessageDTO out = ChatMessageDTO.builder()
                .id(saved.getId())
                .senderId(saved.getSenderId())
                .receiverId(saved.getReceiverId())
                .senderType(saved.getSenderType().name())
                .message(saved.getMessage())
                .timestamp(saved.getTimestamp().toString())
                .build();

        messagingTemplate.convertAndSend("/topic/private." + dto.getReceiverId(), out);

        return ResponseEntity.ok(out);
    }

    @MessageMapping("/chat.send")
    public void sendMessageStomp(@Payload ChatMessageDTO dto) {

        ChatMessage msg = ChatMessage.builder()
                .senderId(dto.getSenderId())
                .receiverId(dto.getReceiverId())
                .senderType(ChatMessage.SenderType.valueOf(dto.getSenderType()))
                .message(dto.getMessage())
                .build();

        ChatMessage saved = service.saveMessage(msg);

        ChatMessageDTO out = ChatMessageDTO.builder()
                .id(saved.getId())
                .senderId(saved.getSenderId())
                .receiverId(saved.getReceiverId())
                .senderType(saved.getSenderType().name())
                .message(saved.getMessage())
                .timestamp(saved.getTimestamp().toString())
                .build();

        // send to receiver
        messagingTemplate.convertAndSend("/topic/chat." + dto.getReceiverId(), out);

        // send to sender (to update UI)
        messagingTemplate.convertAndSend("/topic/chat." + dto.getSenderId(), out);
    }


    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageDTO>> getHistory(
            @RequestParam Integer userId,
            @RequestParam Integer providerId) {
        return ResponseEntity.ok(service.getConversation(userId, providerId));
    }
}
