package com.snccreations.springbootlibrary.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.snccreations.springbootlibrary.entity.Checkout;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    
    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);
    
    List<Checkout> findBooksByUserEmail(String userEmail);

    @Modifying
    @Transactional
    @Query("DELETE FROM Checkout c WHERE c.bookId = :bookId")
    void deleteAllByBookId(@Param("bookId") Long bookId);
}
