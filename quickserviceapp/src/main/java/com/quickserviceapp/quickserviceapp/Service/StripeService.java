package com.quickserviceapp.quickserviceapp.Service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    // @Value("${stripe.apiKey:#{null}}")
    private String stripeApiKey;

    // @Value("${stripe.secret:#{null}}")
    private String stripeSecret;

    // @Value("${stripe.publishableKey:#{null}}")
    private String stripePublishableKey;

    // @Value("${stripe.webhookSecret:}")
    private String stripeWebhookSecret;

    @PostConstruct
    public void init() {
        // prefer apiKey then secret
        String key = stripeApiKey != null ? stripeApiKey : stripeSecret;
        if (key == null || key.isBlank()) {
            // will fail later if someone tries to create a session — but log a helpful message
            System.out.println("[StripeService] No Stripe secret configured (stripe.apiKey or stripe.secret)");
        } else {
            Stripe.apiKey = key;
        }
    }

    public String getPublishableKey() {
        return stripePublishableKey;
    }

    public Session createCheckoutSession(Integer bookingId, Integer amountInPaise, String successUrl, String cancelUrl) throws StripeException {
        if (amountInPaise == null || amountInPaise <= 0) {
            throw new IllegalArgumentException("Invalid amount");
        }

        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName("Booking #" + bookingId)
                        .build();

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("inr")
                        .setUnitAmount(Long.valueOf(amountInPaise))
                        .setProductData(productData)
                        .build();

        SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                        .setPriceData(priceData)
                        .setQuantity(1L)
                        .build();

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .addLineItem(lineItem)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putMetadata("bookingId", String.valueOf(bookingId));

        SessionCreateParams params = paramsBuilder.build();
        return Session.create(params);
    }


    public Event constructEvent(String payload, String sigHeader) throws SignatureVerificationException {
        if (stripeWebhookSecret != null && !stripeWebhookSecret.isBlank()) {
            // will throw SignatureVerificationException on mismatch
            return Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } else {
            return Event.GSON.fromJson(payload, Event.class);
        }
    }
}