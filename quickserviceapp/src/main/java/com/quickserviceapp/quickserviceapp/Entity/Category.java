package com.quickserviceapp.quickserviceapp.Entity;

import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int categoryId;

    private String categoryName;

    @ManyToMany(mappedBy = "serviceProviding")
    private List<ServiceProvider> providers = new ArrayList<>();

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<ServiceProvider> getProviders() {
        return providers;
    }

    public void setProviders(List<ServiceProvider> providers) {
        this.providers = providers;
    }
}
