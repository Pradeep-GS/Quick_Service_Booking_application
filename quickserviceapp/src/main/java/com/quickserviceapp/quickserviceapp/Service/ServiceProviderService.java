package com.quickserviceapp.quickserviceapp.Service;

import com.quickserviceapp.quickserviceapp.DTO.ProviderDTO;
import com.quickserviceapp.quickserviceapp.DTO.BookingResponseDTO;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Entity.ServiceProvider;
import com.quickserviceapp.quickserviceapp.Entity.Booking;
import com.quickserviceapp.quickserviceapp.Repository.CategoryRepository;
import com.quickserviceapp.quickserviceapp.Repository.ServiceProviderRepository;
import com.quickserviceapp.quickserviceapp.Repository.BookingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ServiceProviderService {

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public ServiceProvider registerProvider(ProviderDTO dto) {
        if (serviceProviderRepository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already exists");

        if (serviceProviderRepository.existsByMobileNumber(dto.getMobileNumber()))
            throw new RuntimeException("Mobile number already exists");

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

        if (dto.getServiceProvidingIds() != null && !dto.getServiceProvidingIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(dto.getServiceProvidingIds());
            provider.setServiceProviding(new HashSet<>(categories));
        }

        return serviceProviderRepository.save(provider);
    }

    public Optional<ServiceProvider> validateProvider(String email, String password) {
        return serviceProviderRepository.findByEmailAndPassword(email, password);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<ServiceProvider> getAllProviders() {
        return serviceProviderRepository.findAll();
    }

    public ServiceProvider getProviderById(Integer id) {
        return serviceProviderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    public boolean isExist(String email, String mobileNumber) {
        return serviceProviderRepository.existsByEmailOrMobileNumber(email, mobileNumber);
    }

    @Transactional
    public ServiceProvider updateProvider(Integer id, ProviderDTO dto) {
        ServiceProvider provider = getProviderById(id);

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

        if (dto.getServiceProvidingIds() != null && !dto.getServiceProvidingIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(dto.getServiceProvidingIds());
            provider.setServiceProviding(new HashSet<>(categories));
        }

        return serviceProviderRepository.save(provider);
    }

    // Dashboard statistics for provider
    public Map<String, Long> getProviderDashboardStats(Integer providerId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalOrders", bookingRepository.countByProvider_Id(providerId));
        stats.put("pending", bookingRepository.countByProvider_IdAndStatus(providerId, Booking.Status.PENDING));
        stats.put("accepted", bookingRepository.countByProvider_IdAndStatus(providerId, Booking.Status.ACCEPTED));
        stats.put("completed", bookingRepository.countByProvider_IdAndStatus(providerId, Booking.Status.COMPLETED));
        stats.put("cancelled", bookingRepository.countByProvider_IdAndStatus(providerId, Booking.Status.CANCELLED));
        return stats;
    }

    // Get all pending bookings (notifications) for provider
    public List<BookingResponseDTO> getProviderNotifications(Integer providerId) {
        return bookingRepository
                .findByProvider_IdAndStatusOrderByBookingDateDesc(providerId, Booking.Status.PENDING)
                .stream()
                .map(this::mapBookingToDTO)
                .collect(Collectors.toList());
    }

    // Get all bookings for provider
    public List<BookingResponseDTO> getProviderBookingHistory(Integer providerId) {
        return bookingRepository
                .findByProvider_IdOrderByBookingDateDesc(providerId)
                .stream()
                .map(this::mapBookingToDTO)
                .collect(Collectors.toList());
    }

    // Helper to convert Booking entity to DTO
    private BookingResponseDTO mapBookingToDTO(Booking booking) {
        String serviceName = booking.getService() != null ? booking.getService().getCategoryName() : "N/A";

        return BookingResponseDTO.builder()
                .bookingId(booking.getId())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userName(booking.getUserName())
                .userMobile(booking.getUserMobile())
                .userAddress(booking.getUserAddress())
                .serviceName(serviceName)
                .bookingDate(booking.getBookingDate().toString())
                .bookingTime(booking.getBookingTime().toString())
                .description(booking.getDescription())
                .status(booking.getStatus().name())
                .paymentDone(booking.getPaymentStatus() == Booking.PaymentStatus.PAID)
                .build();
    }
}
