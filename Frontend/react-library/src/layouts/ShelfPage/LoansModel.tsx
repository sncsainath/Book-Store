import React from "react";
import ShelfCurrentLoans from "../../models/ShelfCurrentLoans";
import defaultImg from '../../Images/BooksImages/book-luv2code-1000.png';

interface LoansModelProps {
    shelfCurrentLoans: ShelfCurrentLoans;
    mobile: boolean;
    baseUrl: string;
    token: string;
}

export const LoansModel: React.FC<LoansModelProps> = ({ shelfCurrentLoans, mobile, baseUrl, token }) => {
    const modalId = mobile ? `mobilemodal${shelfCurrentLoans.book.id}` : `modal${shelfCurrentLoans.book.id}`;
    const daysLeft = shelfCurrentLoans.daysLeft;
    const bookImg = shelfCurrentLoans.book.img || defaultImg;

    const returnBookUrl = `${baseUrl}/api/books/secure/return?bookId=${shelfCurrentLoans.book.id}`;
    const renewLoanUrl = `${baseUrl}/api/books/secure/renew/loan?bookId=${shelfCurrentLoans.book.id}`;

    const returnBook = async () => {
        try {
            const response = await fetch(returnBookUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to return book');
            }
            // Handle successful return
        } catch (error) {
            console.error(error);
        }
    };

    const renewLoan = async () => {
        try {
            const response = await fetch(renewLoanUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to renew loan');
            }
            // Handle successful renewal
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            Loan Options
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="mt-3">
                                <div className="row">
                                    <div className="col-2">
                                        <img src={bookImg} width="56" height="87" alt="Book" />
                                    </div>
                                    <div className="col-10">
                                        <h6>{shelfCurrentLoans.book.author}</h6>
                                        <h4>{shelfCurrentLoans.book.title}</h4>
                                    </div>
                                </div>
                                <hr />
                                {daysLeft > 0 && (
                                    <p className="text-secondary">Due in {daysLeft} days.</p>
                                )}
                                {daysLeft === 0 && (
                                    <p className="text-success">Due Today.</p>
                                )}
                                {daysLeft < 0 && (
                                    <p className="text-danger">Past due by {Math.abs(daysLeft)} days.</p>
                                )}
                                <div className="list-group mt-3">
                                    <button onClick={returnBook} data-bs-dismiss="modal" className="list-group-item list-group-item-action" aria-current="true">
                                        Return Book
                                    </button>
                                    <button onClick={renewLoan} data-bs-dismiss="modal"
                                        className={daysLeft < 0 ? "list-group-item list-group-item-action inactiveLink" : "list-group-item list-group-item-action"}>
                                        {daysLeft < 0 ? "Late dues cannot be renewed" : "Renew loan for 7 days"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
