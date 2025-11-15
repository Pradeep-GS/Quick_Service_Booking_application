package com.quickserviceapp.quickserviceapp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "service_category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String categoryName;

    @ManyToMany(mappedBy = "serviceProviding", fetch = FetchType.LAZY)
    @JsonBackReference
    private Set<ServiceProvider> providers = new HashSet<>();

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Set<ServiceProvider> getProviders() {
        return providers;
    }

    public void setProviders(Set<ServiceProvider> providers) {
        this.providers = providers;
    }
}
