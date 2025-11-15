package com.quickserviceapp.quickserviceapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "USERS")   // matches your DB table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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

    @Column(name = "country")
    private String country;

    @Column(name = "address")
    private String address;

    @Column(name = "pincode")
    private Integer pincode;

    @Column(name = "district")
    private String district;

    @Column(name = "state")
    private String state;
}
