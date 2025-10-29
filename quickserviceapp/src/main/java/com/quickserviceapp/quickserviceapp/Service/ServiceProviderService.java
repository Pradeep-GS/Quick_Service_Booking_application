package com.quickserviceapp.quickserviceapp.Service;

import com.quickserviceapp.quickserviceapp.DTO.ProviderDTO;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Repository.CategoryRepository;
import com.quickserviceapp.quickserviceapp.Repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceProviderService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public boolean CreateProvider(@RequestBody ProviderDTO dto) {
        if (isexist(dto.getEmail(), dto.getMobileNumber())) {
            return false;
        }
        ServiceProvider service = new ServiceProvider();
        service.setName(dto.getName());
        service.setEmail(dto.getEmail());
        service.setPassword(dto.getPassword());
        service.setMobileNumber(dto.getMobileNumber());
        service.setGender(dto.getGender());
        service.setYearOfExperience(dto.getYearOfExperience());
        service.setSalaryPerHr(dto.getSalaryPerHr());
        service.setDob(dto.getDob());
        service.setAge(dto.getAge());
        service.setCountry(dto.getCountry());
        service.setAddress(dto.getAddress());
        service.setPincode(dto.getPincode());
        service.setDistrict(dto.getDistrict());
        service.setState(dto.getState());
        if (dto.getServiceProvidingIds() != null && !dto.getServiceProvidingIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(dto.getServiceProvidingIds());
            service.setServiceProviding(categories);
        }
        serviceRepository.save(service);
        return true;
    }

    public boolean isexist(@RequestBody String email, String mobileNumber) {
        return serviceRepository.findBymobileNumber(mobileNumber).isPresent() ||
                serviceRepository.findByemail(email).isPresent();
    }

    public boolean login(@RequestBody String email, String password) {
        Optional<ServiceProvider> optProvider = serviceRepository.findByemail(email);
        if (optProvider.isPresent()) {
            ServiceProvider service = optProvider.get();
            return service.getPassword().equals(password);
        }
        return false;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
