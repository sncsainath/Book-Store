package com.snccreations.springbootlibrary.requestmodels;

import lombok.Data;

@Data
public class AddBookRequest {

    private String title;

    private String author;

    private String description;

    private int copies;

    private String category;

    private String img;

	public String getTitle() {
		return title;
	}

	public String getAuthor() {
		return author;
	}

	public String getDescription() {
		return description;
	}

	public int getCopies() {
		return copies;
	}

	public String getCategory() {
		return category;
	}

	public String getImg() {
		return img;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setCopies(int copies) {
		this.copies = copies;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public void setImg(String img) {
		this.img = img;
	}

}
