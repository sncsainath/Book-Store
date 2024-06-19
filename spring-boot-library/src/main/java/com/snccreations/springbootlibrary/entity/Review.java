package com.snccreations.springbootlibrary.entity;

import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "date")
    @CreationTimestamp
    private Timestamp date;

    @Column(name = "rating")
    private double rating;

    @Column(name = "book_id")
    private Long bookId;

    @Column(name = "review_description")
    private String reviewDescription;

    // Manually add the setter methods if they are missing or not generated correctly

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public void setReviewDescription(String reviewDescription) {
        this.reviewDescription = reviewDescription;
    }
}
