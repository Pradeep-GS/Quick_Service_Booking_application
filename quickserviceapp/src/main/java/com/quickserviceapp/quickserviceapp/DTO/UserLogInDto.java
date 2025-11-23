package com.quickserviceapp.quickserviceapp.DTO;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserLogInDto {
    private String mailID;
    private String password;
}
