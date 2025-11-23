package com.quickserviceapp.quickserviceapp.DTO;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProviderDTO {
    private String name;
    private String email;
    private String password;
    private String mobileNumber;
    private String gender;
    private List<Integer> serviceProvidingIds; // as requested
    private Integer yearOfExperience;
    private Float salaryPerHr;
    private LocalDate dob;
    private Integer age;
    private String country;
    private String address;
    private String pincode;
    private String district;
    private String state;
}
