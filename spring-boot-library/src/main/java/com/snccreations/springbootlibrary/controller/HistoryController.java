package com.snccreations.springbootlibrary.controller;

import com.snccreations.springbootlibrary.dao.HistoryRepository;
import com.snccreations.springbootlibrary.entity.History;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/histories")
public class HistoryController {

    private final HistoryRepository historyRepository;

    @Autowired
    public HistoryController(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @GetMapping("/findBooksByUserEmail")
    public Page<History> findBooksByUserEmail(@RequestParam String userEmail, Pageable pageable) {
        return historyRepository.findBooksByUserEmail(userEmail, pageable);
    }

    // Add more endpoints as needed for CRUD operations or other functionalities related to history
}
