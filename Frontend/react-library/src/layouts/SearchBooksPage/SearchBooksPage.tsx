import React, { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book category');

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl = "http://13.51.160.178:8080/api/books";
            const url = searchUrl === '' 
                ? `${baseUrl}?projection=bookProjection&page=${currentPage - 1}&size=${booksPerPage}`
                : baseUrl + searchUrl.replace('<pageNumber>', `${currentPage - 1}`);

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Something went wrong!");

                const responseData = await response.json();
                setTotalAmountOfBooks(responseData.page.totalElements);
                setTotalPages(responseData.page.totalPages);

                const booksData: BookModel[] = responseData._embedded.books.map((book: any) => new BookModel(
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
            } catch (error: any) {
                setHttpError(error.message);
                console.error("Fetch error: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) return <SpinnerLoading />;
    if (httpError) return <div className="container m-5"><p>{httpError}</p></div>;

    const handleSearchChange = () => {
        setCurrentPage(1);
        setSearchUrl(search === ''
            ? ''
            : `/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        setCategorySelection('Book category');
    };

    const handleCategoryChange = (value: string) => {
        setCurrentPage(1);
        const validCategories = ['fe', 'be', 'data', 'devops'];
        const isValidCategory = validCategories.includes(value.toLowerCase());

        setCategorySelection(value);
        setSearchUrl(isValidCategory
            ? `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`
            : `?page=<pageNumber>&size=${booksPerPage}`);
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const lastItem = Math.min(indexOfLastBook, totalAmountOfBooks);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-6">
                    <div className="d-flex">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-labelledby="Search"
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button
                            className="btn btn-outline-success"
                            onClick={handleSearchChange}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="col-4">
                    <div className="dropdown btn btn-main text-white">
                        <button 
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {categorySelection}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li onClick={() => handleCategoryChange('All')}>
                                <a className="dropdown-item" href="#">All</a>
                            </li>
                            <li onClick={() => handleCategoryChange('FE')}>
                                <a className="dropdown-item" href="#">Front End</a>
                            </li>
                            <li onClick={() => handleCategoryChange('BE')}>
                                <a className="dropdown-item" href="#">Back End</a>
                            </li>
                            <li onClick={() => handleCategoryChange('Data')}>
                                <a className="dropdown-item" href="#">Data</a>
                            </li>
                            <li onClick={() => handleCategoryChange('DevOps')}>
                                <a className="dropdown-item" href="#">DevOps</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {totalAmountOfBooks > 0 ? (
                <>
                    <div className="mt-3">
                        <h5>Number of results: ({totalAmountOfBooks})</h5>
                    </div>
                    <p>{indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:</p>
                    {books.map(book => (
                        <SearchBook book={book} key={book.id} />
                    ))}
                </>
            ) : (
                <div className="m-5">
                    <h3>Can't find what you are looking for?</h3>
                    <a type="button" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white" href="#">
                        Library Services
                    </a>
                </div>
            )}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
};
