package com.quickserviceapp.quickserviceapp.Service;

import com.quickserviceapp.quickserviceapp.DTO.ProviderDTO;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Repository.CategoryRepository;
import com.quickserviceapp.quickserviceapp.Repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class ServiceProviderService {

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // ✅ Register a new provider
    @Transactional
    public ServiceProvider registerProvider(ProviderDTO dto) {
        // Duplicate checks
        if (serviceProviderRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (serviceProviderRepository.existsByMobileNumber(dto.getMobileNumber())) {
            throw new RuntimeException("Mobile number already exists");
        }

        ServiceProvider provider = new ServiceProvider();
        provider.setName(dto.getName());
        provider.setEmail(dto.getEmail());
        provider.setPassword(dto.getPassword());
        provider.setMobileNumber(dto.getMobileNumber());
        provider.setGender(dto.getGender());
        provider.setYearOfExperience(dto.getYearOfExperience());
        provider.setSalaryPerHr(dto.getSalaryPerHr());
        provider.setDob(dto.getDob());
        provider.setAge(dto.getAge());
        provider.setCountry(dto.getCountry());
        provider.setAddress(dto.getAddress());
        provider.setPincode(dto.getPincode());
        provider.setDistrict(dto.getDistrict());
        provider.setState(dto.getState());

        // Attach categories
        if (dto.getServiceProvidingIds() != null && !dto.getServiceProvidingIds().isEmpty()) {
            List<Category> cats = categoryRepository.findAllById(dto.getServiceProvidingIds());
            if (cats.isEmpty()) {
                throw new RuntimeException("Provided category ids are invalid");
            }
            provider.setServiceProviding(new HashSet<>(cats));
        }

        return serviceProviderRepository.save(provider);
    }

    // ✅ Validate login
    public Optional<ServiceProvider> validateProvider(String email, String password) {
        return serviceProviderRepository.findByEmailAndPassword(email, password);
    }

    // ✅ Fetch all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // ✅ Fetch all providers
    public List<ServiceProvider> getAllProviders() {
        return serviceProviderRepository.findAll();
    }

    // ✅ Get provider by ID
    public ServiceProvider getProviderById(int id) {
        return serviceProviderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + id));
    }

    // ✅ Check if provider already exists by email or mobile number
    public boolean isExist(String email, String mobileNumber) {
        return serviceProviderRepository.existsByEmailOrMobileNumber(email, mobileNumber);
    }
}
