package com.quickserviceapp.quickserviceapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingDTO {
    private Integer bookingId;
    private Integer rating;
    private String comment;
}
