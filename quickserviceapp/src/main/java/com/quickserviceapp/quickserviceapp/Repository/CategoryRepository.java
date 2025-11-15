package com.quickserviceapp.quickserviceapp.Repository;

import com.quickserviceapp.quickserviceapp.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
