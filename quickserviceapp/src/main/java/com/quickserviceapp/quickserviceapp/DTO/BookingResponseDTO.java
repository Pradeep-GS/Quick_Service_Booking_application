package com.quickserviceapp.quickserviceapp.DTO;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingResponseDTO {
    private Integer bookingId;

    private Integer userId;
    private String userName;
    private String userMobile;
    private String userAddress;

    private String serviceName;
    private String providerName;

    private String bookingDate;   // formatted yyyy-MM-dd
    private String bookingTime;   // formatted HH:mm

    private String description;

    private String status;
    private Boolean paymentDone;
    private String paymentId;
    private Integer amountInPaise;
}
