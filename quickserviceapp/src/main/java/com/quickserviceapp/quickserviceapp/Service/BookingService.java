package com.quickserviceapp.quickserviceapp.Service;

import com.quickserviceapp.quickserviceapp.DTO.BookingDTO;
import com.quickserviceapp.quickserviceapp.DTO.BookingResponseDTO;
import com.quickserviceapp.quickserviceapp.Entity.Booking;
import com.quickserviceapp.quickserviceapp.Entity.Category;
import com.quickserviceapp.quickserviceapp.Repository.BookingRepository;
import com.quickserviceapp.quickserviceapp.Repository.CategoryRepository;
import com.quickserviceapp.quickserviceapp.Repository.ServiceProviderRepository;
import com.quickserviceapp.quickserviceapp.Repository.UserRepository;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ServiceProviderRepository providerRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private StripeService stripeService;

    // Provide sensible example URLs in properties; these are used if you don't pass custom URLs
    @Value("${app.frontend.successUrl:http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}}")
    private String successUrlTemplate;

    @Value("${app.frontend.cancelUrl:http://localhost:5173/payment-failed}")
    private String cancelUrl;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    public Booking createBooking(BookingDTO dto) {
        var user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Invalid user id"));

        var provider = providerRepository.findById(dto.getProviderId())
                .orElseThrow(() -> new RuntimeException("Invalid provider id"));

        Category category = null;
        if (dto.getServiceId() != null && dto.getServiceId() != 0) {
            category = categoryRepository.findById(dto.getServiceId()).orElse(null);
        }

        Integer amountInPaise = null;
        if (provider.getSalaryPerHr() != null && provider.getSalaryPerHr() > 0) {
            amountInPaise = Math.round(provider.getSalaryPerHr() * 100);
        }

        Booking booking = Booking.builder()
                .user(user)
                .provider(provider)
                .service(category)
                .bookingDate(LocalDate.parse(dto.getBookingDate()))
                .bookingTime(LocalTime.parse(dto.getBookingTime()))
                .description(dto.getDescription())
                .userName(dto.getUserName() != null ? dto.getUserName() : user.getUserName())
                .userAddress(dto.getUserAddress() != null ? dto.getUserAddress() : user.getAddress())
                .userMobile(dto.getUserMobile() != null ? dto.getUserMobile() : user.getMobileNumber())
                .status(Booking.Status.PENDING)
                .paymentStatus(Booking.PaymentStatus.NOT_PAID)
                .amountInPaise(amountInPaise)
                .build();

        return bookingRepository.save(booking);
    }

    /**
     * Create a Stripe Checkout session for a booking and store the session id temporarily in paymentId.
     */
    public Session createCheckoutSessionForBooking(Integer bookingId) throws StripeException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getAmountInPaise() == null || booking.getAmountInPaise() <= 0) {
            throw new RuntimeException("Invalid amount configured for this booking");
        }

        String successUrl = successUrlTemplate; // template can include {CHECKOUT_SESSION_ID} if frontend expects it
        Session session = stripeService.createCheckoutSession(
                bookingId,
                booking.getAmountInPaise(),
                successUrl,
                cancelUrl
        );

        // store session id in paymentId for lookup when webhook arrives
        booking.setPaymentId(session.getId());
        bookingRepository.save(booking);

        return session;
    }

     @Transactional
    public void markPaymentDoneFromStripeSession(String stripeSessionId, String paymentIntentId) {

        // Correct lookup using paymentId (which stores sessionId)
        Booking booking = bookingRepository.findByPaymentId(stripeSessionId)
                .orElseThrow(() -> new RuntimeException("Booking not found for session: " + stripeSessionId));

        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        booking.setStatus(Booking.Status.COMPLETED);

        // Store paymentIntentId only if available, else keep sessionId
        booking.setPaymentId(paymentIntentId != null ? paymentIntentId : stripeSessionId);

        bookingRepository.save(booking);
    }
    @Transactional
    public void markPaymentDone(Integer bookingId, String paymentId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        booking.setPaymentId(paymentId);
        booking.setStatus(Booking.Status.COMPLETED);
        bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingByProvider(Integer bookingId, String action) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        switch (action.toUpperCase()) {
            case "ACCEPT":
                booking.setStatus(Booking.Status.ACCEPTED);
                break;
            case "CANCEL":
            case "DECLINE":
            case "REJECT":
                booking.setStatus(Booking.Status.CANCELLED);
                break;
            case "COMPLETE":
            case "FINISH":
                // provider indicates job finished -> keep ACCEPTED and expect payment to complete via checkout
                booking.setStatus(Booking.Status.COMPLETED);
                break;
            default:
                throw new RuntimeException("Invalid action");
        }

        return bookingRepository.save(booking);
    }

    public BookingResponseDTO toResponseDTO(Booking b) {
        return BookingResponseDTO.builder()
                .bookingId(b.getId())
                .userId(b.getUser() != null ? b.getUser().getId() : null)
                .userName(b.getUserName())
                .userMobile(b.getUserMobile())
                .userAddress(b.getUserAddress())
                .serviceName(b.getService() != null ? b.getService().getCategoryName() : "N/A")
                .providerName(b.getProvider() != null ? b.getProvider().getName() : null)
                .bookingDate(b.getBookingDate() != null ? b.getBookingDate().format(dateFormatter) : null)
                .bookingTime(b.getBookingTime() != null ? b.getBookingTime().format(timeFormatter) : null)
                .description(b.getDescription())
                .status(b.getStatus().name())
                .paymentDone(b.getPaymentStatus() == Booking.PaymentStatus.PAID)
                .paymentId(b.getPaymentId())
                .amountInPaise(b.getAmountInPaise())
                .build();
    }

    public List<BookingResponseDTO> getBookingsByUserIdDTO(Integer userId) {
        return bookingRepository.findByUser_IdOrderByBookingDateDesc(userId)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getBookingsByProviderIdDTO(Integer providerId) {
        return bookingRepository.findByProvider_IdOrderByBookingDateDesc(providerId)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getBookingsByProviderIdAndStatusDTO(Integer providerId, String status) {
        return bookingRepository.findByProvider_IdAndStatusOrderByBookingDateDesc(providerId, Booking.Status.valueOf(status.toUpperCase()))
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public long getTotalOrders(Integer providerId) {
        return bookingRepository.countByProvider_Id(providerId);
    }

    public long getCountByStatus(Integer providerId, String status) {
        return bookingRepository.countByProvider_IdAndStatus(providerId, Booking.Status.valueOf(status.toUpperCase()));
    }
}
