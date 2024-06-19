package com.snccreations.springbootlibrary.responsemodels;

import com.snccreations.springbootlibrary.entity.Book;
import lombok.Data;

@Data
public class ShelfCurrentLoansResponse {
    
    public ShelfCurrentLoansResponse() {} // Default constructor
    
    public ShelfCurrentLoansResponse(Book book, int daysLeft) {
        this.book = book;
        this.daysLeft = daysLeft;
    }
    
    private Book book;
    
    private int daysLeft;

    // Getter and Setter methods for properties
    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getDaysLeft() {
        return daysLeft;
    }

    public void setDaysLeft(int daysLeft) {
        this.daysLeft = daysLeft;
    }
}
