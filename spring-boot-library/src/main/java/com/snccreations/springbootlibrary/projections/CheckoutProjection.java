package com.snccreations.springbootlibrary.projections;

import org.springframework.data.rest.core.config.Projection;

import com.snccreations.springbootlibrary.entity.Checkout;

@Projection(name = "checkoutProjection", types = { Checkout.class })
public interface CheckoutProjection {
    Long getBookId();
    String getUserEmail();
    String getCheckoutDate();
    String getReturnDate();
}
