import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";


export const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Corrected bookId extraction from the URL
  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
        const responseReviews = await fetch(reviewUrl);
        if (!responseReviews.ok) throw new Error(`Failed to fetch reviews: ${responseReviews.statusText}`);

        const responseDataReviews = await responseReviews.json();
        const responseDataReviewsEmbedded = responseDataReviews._embedded.reviews;

        setTotalAmountOfReviews(responseDataReviews.page.totalElements);
        setTotalPages(responseDataReviews.page.totalPages);

        let loadedReviews: ReviewModel[] = [];

        for (const key in responseDataReviewsEmbedded) {
          loadedReviews.push({
            id: responseDataReviewsEmbedded[key].id,
            userEmail: responseDataReviewsEmbedded[key].userEmail,
            date: responseDataReviewsEmbedded[key].date,
            rating: responseDataReviewsEmbedded[key].rating,
            book_id: responseDataReviewsEmbedded[key].bookId,
            reviewDescription: responseDataReviewsEmbedded[key].reviewDescription,
          });
        }

        setReviews(loadedReviews);
        setIsLoading(false);
      } catch (error: any) {
        setHttpError(`Error fetching reviews: ${error.message}`);
        console.error("Fetch reviews error: ", error);
      } finally {
        // Removed setIsLoadingReview since it's not defined in the component
        // setIsLoadingReview(false);
      }
    };

    fetchBookReviews();
  }, [currentPage, bookId, reviewsPerPage]); // Added reviewsPerPage as a dependency

  if(httpError){
    return (
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    )
  }

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

  let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container m-5">
        <h3>Comments: ({reviews.length})</h3>
        <p>
            {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
        </p>
        <div className="row">
            {reviews.map(review => (
                <Review review={review} key={review.id}/>
            ))}
        </div>

        {totalPages > 1 && <Pagination currentPage = {currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>
  );
}
