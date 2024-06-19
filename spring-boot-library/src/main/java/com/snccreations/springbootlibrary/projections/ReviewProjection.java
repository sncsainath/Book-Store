package com.snccreations.springbootlibrary.projections;

import com.snccreations.springbootlibrary.entity.Review;
import org.springframework.data.rest.core.config.Projection;

import java.sql.Timestamp;

@Projection(name = "reviewProjection", types = {Review.class})
public interface ReviewProjection {
    Long getId();
    String getUserEmail();
    Timestamp getDate();
    double getRating();
    Long getBookId();
    String getReviewDescription();
}
