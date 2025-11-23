package com.quickserviceapp.quickserviceapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private int userId;
    private int providerId;
    private int rating;
    private String comment;
}
