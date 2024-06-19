class ReviewRequestModel {
    starInput: number;
    reviewDescription: string;
    bookId: number;

    constructor(starInput: number, reviewDescription: string, bookId: number) {
        this.starInput = starInput;
        this.reviewDescription = reviewDescription;
        this.bookId = bookId;
    }
}

export default ReviewRequestModel;
