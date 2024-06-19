package com.snccreations.springbootlibrary.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.snccreations.springbootlibrary.dao.ReviewRepository;
import com.snccreations.springbootlibrary.entity.Review;
import com.snccreations.springbootlibrary.requestmodels.ReviewRequest;

@Service
@Transactional
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        try {
            logger.info("Posting review for user: {}, bookId: {}", userEmail, reviewRequest.getBookId());

            Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
            if (validateReview != null) {
                throw new Exception("Review already created");
            }

            Review review = new Review();
            review.setBookId(reviewRequest.getBookId());
            review.setRating(reviewRequest.getRating());
            review.setUserEmail(userEmail);
            review.setReviewDescription(reviewRequest.getReviewDescription().orElse(null));
            review.setDate(Timestamp.valueOf(LocalDateTime.now()));

            reviewRepository.save(review);
            logger.info("Review saved successfully for user: {}, bookId: {}", userEmail, reviewRequest.getBookId());
        } catch (Exception e) {
            logger.error("Error posting review for user: {}, bookId: {}", userEmail, reviewRequest.getBookId(), e);
            throw e;
        }
    }

    public Boolean userReviewListed(String userEmail, Long bookId) {
        try {
            logger.info("Checking if review exists for user: {}, bookId: {}", userEmail, bookId);
            Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
            return validateReview != null;
        } catch (Exception e) {
            logger.error("Error checking review for user: {}, bookId: {}", userEmail, bookId, e);
            return false;
        }
    }
}
