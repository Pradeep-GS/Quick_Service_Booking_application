package com.quickserviceapp.quickserviceapp.Service;

import com.quickserviceapp.quickserviceapp.DTO.CategoryDTO;
import com.quickserviceapp.quickserviceapp.Entity.Booking;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Entity.User;
import com.quickserviceapp.quickserviceapp.Repository.BookingRepository;
import com.quickserviceapp.quickserviceapp.Repository.CategoryRepository;
import com.quickserviceapp.quickserviceapp.Repository.UserRepository;
import com.quickserviceapp.quickserviceapp.Repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private ServiceProviderRepository providerRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private BookingRepository bookingRepository;

    public Map<String, Long> getDashboardStats() {

        long totalUsers = userRepository.count();
        long totalProviders = providerRepository.count();
        long totalCategories = categoryRepository.count();
        long totalBookings = bookingRepository.count();

        long pending = bookingRepository
                .findAll()
                .stream()
                .filter(b -> b.getStatus() == Booking.Status.PENDING)
                .count();

        long completed = bookingRepository
                .findAll()
                .stream()
                .filter(b -> b.getStatus() == Booking.Status.COMPLETED)
                .count();

        long cancelled = bookingRepository
                .findAll()
                .stream()
                .filter(b -> b.getStatus() == Booking.Status.CANCELLED)
                .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalProviders", totalProviders);
        stats.put("totalCategories", totalCategories);
        stats.put("totalBookings", totalBookings);
        stats.put("pending", pending);
        stats.put("completed", completed);
        stats.put("cancelled", cancelled);

        return stats;
    }

    public boolean deleteUser(int id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean deleteProvider(int id) {
        if (providerRepository.existsById(id)) {
            providerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Category addCategory(CategoryDTO dto) {
        Category category = Category.builder()
                .categoryName(dto.getCategoryName())
                .build();

        return categoryRepository.save(category);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public List<ServiceProvider> getAllProviders() {
        return providerRepository.findAll();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public boolean deleteCategory(int id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }


}
