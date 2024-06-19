import React, { useEffect, useState } from "react";
import axios from "axios";
import ReturnBook from "./ReturnBook";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Carousel: React.FC = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl = "http://13.51.160.178:8080/api/books";
            const url = `${baseUrl}?projection=bookProjection&page=0&size=9`;

            try {
                const response = await axios.get(url);

                const responseData = response.data;

                const booksData = responseData._embedded.books.map((book: any) => new BookModel(
                    book.id,
                    book.title,
                    book.author,
                    book.description,
                    book.copies,
                    book.copiesAvailable,
                    book.category,
                    book.img
                ));

                setBooks(booksData);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
                console.error("Fetch error: ", error); // Log error for debugging
            }
        };

        fetchBooks();
    }, []);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    // Create chunks of books with 3 books each
    const bookChunks = [];
    for (let i = 0; i < books.length; i += 3) {
        bookChunks.push(books.slice(i, i + 3));
    }

    return (
        <div className="container mt-5" style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>
            <div id="carouselExampleControls" className="carousel carousel-dark slide mt-5 d-none d-lg-block" data-bs-interval="false">
                <div className="carousel-inner">
                    {bookChunks.map((chunk, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <div className="row d-flex justify-content-center align-items-center">
                                {chunk.map(book => (
                                    <ReturnBook book={book} key={book.id} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    {books.length > 0 && <ReturnBook book={books[0]} />}
                </div>
            </div>
            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to="/search">View More</Link>
            </div>
        </div>
    );
};
