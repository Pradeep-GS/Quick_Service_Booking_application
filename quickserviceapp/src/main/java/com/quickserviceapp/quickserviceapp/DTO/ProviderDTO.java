package com.quickserviceapp.quickserviceapp.DTO;

import java.time.LocalDate;
import java.util.List;

public class ProviderDTO {
    private String name;
    private String email;
    private String password;
    private String mobileNumber;
    private String gender;
    private List<Integer> serviceProvidingIds;
    private Integer yearOfExperience;
    private Float salaryPerHr;
    private LocalDate dob;
    private Integer age;
    private String country;
    private String address;
    private String pincode;
    private String district;
    private String state;

    public ProviderDTO() {}

    // Getters and setters for all fields
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public List<Integer> getServiceProvidingIds() { return serviceProvidingIds; }
    public void setServiceProvidingIds(List<Integer> serviceProvidingIds) { this.serviceProvidingIds = serviceProvidingIds; }

    public Integer getYearOfExperience() { return yearOfExperience; }
    public void setYearOfExperience(Integer yearOfExperience) { this.yearOfExperience = yearOfExperience; }

    public Float getSalaryPerHr() { return salaryPerHr; }
    public void setSalaryPerHr(Float salaryPerHr) { this.salaryPerHr = salaryPerHr; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}
