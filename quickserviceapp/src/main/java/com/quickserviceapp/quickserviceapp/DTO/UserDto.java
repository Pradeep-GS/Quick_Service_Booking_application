package com.quickserviceapp.quickserviceapp.DTO;
import lombok.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDto {
    private String userName;
    private String mailID;
    private String password;
    private String mobileNumber;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dob;

    private Integer age;
    private String country;
    private String address;
    private String pincode;
    private String district;
    private String state;
}
