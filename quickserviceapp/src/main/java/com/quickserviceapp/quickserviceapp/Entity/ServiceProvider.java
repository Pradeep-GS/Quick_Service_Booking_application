package com.quickserviceapp.quickserviceapp.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "service_provider")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ServiceProvider {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "mobile_number", unique = true)
    private String mobileNumber;

    private String gender;
    private Integer yearOfExperience;
    private Float salaryPerHr;

    private LocalDate dob;
    private Integer age;

    private String country;
    private String address;
    private String pincode;
    private String district;
    private String state;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "provider_category",
        joinColumns = @JoinColumn(name = "provider_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> serviceProviding = new HashSet<>();

    public ServiceProvider(int id) { this.id = id; }
}
