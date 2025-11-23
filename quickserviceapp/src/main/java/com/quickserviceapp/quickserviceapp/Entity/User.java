package com.quickserviceapp.quickserviceapp.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "mail_id", nullable = false, unique = true)
    private String mailID;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "mobile_number", unique = true)
    private String mobileNumber;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "age")
    private Integer age;

    private String country;
    private String address;
    private String pincode;
    private String district;
    private String state;

    public User(int id) { this.id = id; }
}
