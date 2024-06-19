package com.snccreations.springbootlibrary.dao;

import com.snccreations.springbootlibrary.entity.Review;
import com.snccreations.springbootlibrary.projections.ReviewProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

@RepositoryRestResource(excerptProjection = ReviewProjection.class)
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByBookId(@RequestParam("book_id") Long bookId, Pageable pageable);

    Review findByUserEmailAndBookId(String userEmail, Long bookId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Review r WHERE r.bookId = :bookId")
    void deleteAllByBookId(@Param("bookId") Long bookId);
}
