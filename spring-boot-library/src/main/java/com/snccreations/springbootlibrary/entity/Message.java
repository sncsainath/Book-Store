package com.snccreations.springbootlibrary.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "messages")
@Data
public class Message {

    public Message(){}

    public Message(String title, String question) {
        this.title = title;
        this.question = question;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="user_email")
    private String userEmail;

    @Column(name="title")
    private String title;

    @Column(name="question")
    private String question;

    @Column(name="admin_email")
    private String adminEmail;

    @Column(name="response")
    private String response;

    @Column(name="closed")
    private boolean closed;

	public Long getId() {
		return id;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public String getTitle() {
		return title;
	}

	public String getQuestion() {
		return question;
	}

	public String getAdminEmail() {
		return adminEmail;
	}

	public String getResponse() {
		return response;
	}

	public boolean isClosed() {
		return closed;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public void setAdminEmail(String adminEmail) {
		this.adminEmail = adminEmail;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public void setClosed(boolean closed) {
		this.closed = closed;
	}
}



