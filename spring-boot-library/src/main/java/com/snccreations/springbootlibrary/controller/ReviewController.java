package com.snccreations.springbootlibrary.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.snccreations.springbootlibrary.requestmodels.ReviewRequest;
import com.snccreations.springbootlibrary.service.ReviewService;
import com.snccreations.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/secure/user/book")
    public Boolean reviewBookByUser(@RequestHeader(value = "Authorization") String token,
                                    @RequestParam Long bookId) throws Exception {
        try {
            String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
            if (userEmail == null) {
                throw new Exception("User Email is missing");
            }
            return reviewService.userReviewListed(userEmail, bookId);
        } catch (Exception e) {
            logger.error("Error in reviewBookByUser: ", e);
            throw e;
        }
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception {
        try {
            logger.info("Review request received: {}", reviewRequest);
            String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
            if (userEmail == null) {
                throw new Exception("User Email is missing");
            }
            reviewService.postReview(userEmail, reviewRequest);
        } catch (Exception e) {
            logger.error("Error in postReview: ", e);
            throw e;
        }
    }
}
