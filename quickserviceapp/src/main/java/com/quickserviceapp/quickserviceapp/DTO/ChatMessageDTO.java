package com.quickserviceapp.quickserviceapp.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
    private Integer id;
    private Integer senderId;
    private Integer receiverId;
    private String senderType;
    private String message;
    private String timestamp;
}
