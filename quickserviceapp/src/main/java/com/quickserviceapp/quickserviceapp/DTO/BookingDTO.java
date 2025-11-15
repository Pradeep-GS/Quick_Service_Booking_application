package com.quickserviceapp.quickserviceapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingDTO {
    private int userId;
    private int providerId;
    private int serviceId;
    private String bookingDate;
    private String bookingTime;
    private String description;
}
