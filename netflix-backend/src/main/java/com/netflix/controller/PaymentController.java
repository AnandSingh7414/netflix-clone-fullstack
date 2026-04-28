package com.netflix.backend.controller; // 🔥 Package name 'backend' ke saath update kar diya hai

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = this.stripeSecretKey;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, Object> data) {
        System.out.println("!!! PAYMENT ATTEMPT DETECTED !!!");
        try {
            String planName = (String) data.get("planName");
            long amount = Long.parseLong(data.get("amount").toString());

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:5173/success")
                    .setCancelUrl("http://localhost:5173/cancel")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("inr")
                                                    .setUnitAmount(amount)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Netflix - " + planName)
                                                                    .build())
                                                    .build())
                                    .build())
                    .build();

            Session session = Session.create(params);
            Map<String, String> responseData = new HashMap<>();
            responseData.put("url", session.getUrl());

            System.out.println("SUCCESS: Session created, URL sent back!");
            return ResponseEntity.ok(responseData);

        } catch (Exception e) {
            System.out.println("ERROR IN STRIPE: " + e.getMessage());
            Map<String, String> errorData = new HashMap<>();
            errorData.put("error", e.getMessage());
            return ResponseEntity.status(500).body(errorData);
        }
    }
}