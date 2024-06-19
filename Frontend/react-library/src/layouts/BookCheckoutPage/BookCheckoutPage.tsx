import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage: React.FC = () => {
  
  const { authState } = useOktaAuth();
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<BookModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [currentLoansCount, setCurrentLoansCount] = useState(0);

  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [displayError, setDisplayError] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://13.51.160.178:8080/api/books/${id}?projection=bookProjection`);
        if (!response.ok) throw new Error(`Failed to fetch book data: ${response.statusText}`);

        const responseData = await response.json();
        const loadedBook: BookModel = {
          id: responseData.id,
          title: responseData.title,
          author: responseData.author,
          description: responseData.description,
          copies: responseData.copies,
          copiesAvailable: responseData.copiesAvailable,
          category: responseData.category,
          img: responseData.img,
        };
        setBook(loadedBook);
      } catch (error: any) {
        setHttpError(`Error fetching book: ${error.message}`);
        console.error("Fetch book error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        const reviewUrl: string = `http://13.51.160.178:8080/api/reviews/search/findByBookId?bookId=${id}`;
        const responseReviews = await fetch(reviewUrl);
        if (!responseReviews.ok) throw new Error(`Failed to fetch reviews: ${responseReviews.statusText}`);

        const responseDataReviews = await responseReviews.json();
        const responseDataReviewsEmbedded = responseDataReviews._embedded.reviews;

        let weightedStarReviews: number = 0;
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

          weightedStarReviews += responseDataReviewsEmbedded[key].rating;
        }

        if (loadedReviews.length > 0) {
          const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
          setTotalStars(parseFloat(round));
        }
        setReviews(loadedReviews);
      } catch (error: any) {
        setHttpError(`Error fetching reviews: ${error.message}`);
        console.error("Fetch reviews error: ", error);
      } finally {
        setIsLoadingReview(false);
      }
    };

    fetchBookReviews();
  }, [id]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (authState?.isAuthenticated) {
        try {
          const url = `http://13.51.160.178:8080/api/books/secure/currentloans/count`;
          const requestOptions = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authState.accessToken?.accessToken}`,
              "Content-Type": "application/json",
            },
          };
          const currentLoansCountResponse = await fetch(url, requestOptions);
          if (!currentLoansCountResponse.ok) throw new Error("Failed to fetch current loans count");

          const currentLoansCountResponseJson = await currentLoansCountResponse.json();
          setCurrentLoansCount(currentLoansCountResponseJson);

          const isCheckedOutUrl = `http://13.51.160.178:8080/api/books/secure/ischeckedout/byuser?bookId=${id}`;
          const isCheckedOutResponse = await fetch(isCheckedOutUrl, requestOptions);
          if (!isCheckedOutResponse.ok) throw new Error("Failed to fetch checked out status");

          const isCheckedOutResponseJson = await isCheckedOutResponse.json();
          setIsCheckedOut(isCheckedOutResponseJson);

          const isReviewLeftUrl = `http://13.51.160.178:8080/api/reviews/secure/user/book?bookId=${id}`;
          const isReviewLeftResponse = await fetch(isReviewLeftUrl, requestOptions);
          if (!isReviewLeftResponse.ok) throw new Error("Failed to fetch review status");

          const isReviewLeftResponseJson = await isReviewLeftResponse.json();
          setIsReviewLeft(isReviewLeftResponseJson);
        } catch (error: any) {
          setHttpError(`Error fetching user info: ${error.message}`);
          console.error("Fetch user info error: ", error);
        }
      }
      setIsLoading(false);
    };

    fetchUserInfo();
  }, [authState, id]);

  if (isLoading || isLoadingReview) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <div className="container m-5"><p>{httpError}</p></div>;
  }

  const checkoutBook = async () => {
    const url = `http://13.51.160.178:8080/api/books/secure/checkout?bookId=${id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const checkoutResponse = await fetch(url, requestOptions);
      if (!checkoutResponse.ok) {
        setDisplayError(true);
        throw new Error("Something went wrong!");
      }
      setIsCheckedOut(true);
    } catch (error: any) {
      setHttpError(`Error checking out book: ${error.message}`);
      console.error("Checkout book error: ", error);
    }
  };

  const submitReview = async (starInput: number, reviewDescription: string) => {
    const url = `http://13.51.160.178:8080/api/reviews/secure`;
    const reviewRequestModel = new ReviewRequestModel(starInput, reviewDescription, Number(book?.id));  // Ensure book.id is a number
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };

    try {
      const reviewResponse = await fetch(url, requestOptions);
      if (!reviewResponse.ok) throw new Error("Something went wrong!");

      setIsReviewLeft(true);
    } catch (error: any) {
      setHttpError(`Error submitting review: ${error.message}`);
      console.error("Submit review error: ", error);
    }
  };

  return (
    <div>
        <div className='container d-none d-lg-block'>
            <div className='row mt-5'>
                <div className='col-sm-2 col-md-2'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='col-4 col-md-4 container'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                    checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
            </div>
            <hr />
            <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
        </div>
        <div className='container d-lg-none mt-5'>
            <div className='d-flex justify-content-center align-items-center'>
                {book?.img ?
                    <img src={book?.img} width='226' height='349' alt='Book' />
                    :
                    <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                        height='349' alt='Book' />
                }
            </div>
            <div className='mt-4'>
                <div className='ml-2'>
                    <h2>{book?.title}</h2>
                    <h5 className='text-primary'>{book?.author}</h5>
                    <p className='lead'>{book?.description}</p>
                    <StarsReview rating={totalStars} size={32} />
                </div>
            </div>
            <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} 
                isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
            <hr />
            <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
        </div>
    </div>
  );
};
