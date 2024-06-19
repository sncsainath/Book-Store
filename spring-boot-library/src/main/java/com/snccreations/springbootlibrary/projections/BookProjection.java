package com.snccreations.springbootlibrary.projections;

import com.snccreations.springbootlibrary.entity.Book;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "bookProjection", types = { Book.class })
public interface BookProjection {
    Long getId();
    String getTitle();
    String getAuthor();
    String getDescription();
    int getCopies();
    int getCopiesAvailable();
    String getCategory();
    String getImg();
}
