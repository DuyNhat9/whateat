import React, { useEffect, useState, useContext } from "react";
import "./RecipeReview.css";
import StarRatings from "react-star-ratings";
import { BsFillPersonFill } from "react-icons/bs";
import axios from "axios";
import AppContext from "../../context/AppContext";

const RecipeReview = ({ recipeId }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [reviews, setReviews] = useState([]);
  const { triggerReload } = useContext(AppContext);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/reviews?RecipeId=${recipeId}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
    })
      .then((res) => {
        console.log(res.data);
        setReviews(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [triggerReload]);

  return (
    <div className="recipe-reviews-container">
      <h1>Khám phá bình luận của người khác</h1>
      {reviews.length > 0 ? (
        reviews.map((review, idx) => {
          const { rating, comment, customer } = review;
          const [userId] = customer.customerId.split("-");

          return (
            <div key={idx} className="single-review">
              {!customer.avatarUrl ? (
                <BsFillPersonFill className="avatar-img" />
              ) : (
                <img
                  className="avatar-img"
                  src={customer.avatarUrl}
                  alt="avatar"
                />
              )}
              <div className="review-detail">
                <p className="username">
                  {customer.name ? customer.name : `User${userId}`}
                </p>
                <StarRatings
                  rating={rating}
                  starRatedColor="brown"
                  numberOfStars={5}
                  name="rating"
                  starDimension="25px"
                  starSpacing="3px"
                />
                <p className="review-content">{comment}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p>Chưa có bình luận nào cho món ăn này</p>
      )}
    </div>
  );
};

export default RecipeReview;
