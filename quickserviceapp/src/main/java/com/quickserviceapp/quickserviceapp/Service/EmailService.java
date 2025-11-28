package com.quickserviceapp.quickserviceapp.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void LoginFunction(String toaddressString , String name) {
        String subject = "Login Successful";
        String message = "Dear " + name+ ",\n\n" +
                            "You Have Successfully Logged into Your Quick Service Booking Account \n\n" +
                            "Best regards,\n" +
                            "Quick Service Booking Team";
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(toaddressString);
        mail.setSubject(subject);
        mail.setText(message);
        mail.setFrom("quickserbooking@gmail.com");
        mailSender.send(mail);
    }

    public void ProfileUpdateFunction(String toaddressString , String name) {
        String subject = "Profile Updated Successfully";
        String message = "Dear " + name + ",\n\n" +
                            "Your profile information has been successfully updated in your Quick Service Booking account.\n\n" +
                            "If you did not make these changes, please contact our support team immediately.\n\n" +
                            "Best regards,\n" +
                            "Quick Service Booking Team";
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(toaddressString);
        mail.setSubject(subject);
        mail.setText(message);
        mail.setFrom("quickserbooking@gmail.com");
        mailSender.send(mail);
    }

    public void BookingConfirmationFunction(String toaddressString , String name , String bookingDetails) {
        String subject = "Booking Confirmation";
        String message = "Dear " + name + ",\n\n" +
                            "Thank you for your booking with Quick Service Booking. Here are your booking details:\n\n" +
                            bookingDetails + "\n\n" +
                            "We look forward to serving you!\n\n" +
                            "Best regards,\n" +
                            "Quick Service Booking Team";
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(toaddressString);
        mail.setSubject(subject);
        mail.setText(message);
        mail.setFrom("quickserbooking@gmail.com");
        mailSender.send(mail);
    }
}
