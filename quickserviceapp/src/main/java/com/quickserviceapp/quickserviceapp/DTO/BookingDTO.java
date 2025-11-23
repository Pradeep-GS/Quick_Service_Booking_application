package com.quickserviceapp.quickserviceapp.DTO;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingDTO {
    private Integer userId;
    private Integer providerId;
    private Integer serviceId;      // optional (can be null/0)
    private String bookingDate;     // "yyyy-MM-dd"
    private String bookingTime;     // "HH:mm"
    private String description;
    private String userName;        // optional override
    private String userAddress;     // optional override
    private String userMobile;      // optional override
}
