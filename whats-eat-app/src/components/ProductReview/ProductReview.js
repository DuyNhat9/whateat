import React, { useEffect, useState } from "react";
import "./ProductReview.css";
import StarRatings from "react-star-ratings";
import { BsFillPersonFill } from "react-icons/bs";
import axios from "axios";

const ProductReview = ({ productId }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Product/reviews?ProductId=${productId}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
    })
      .then((res) => {
        console.log(res.data);
        setReviews(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="product-reviews-container">
      <h1>Khám phá đánh giá của người khác</h1>
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
        <p>Chưa có đánh giá nào cho sản phẩm này</p>
      )}
    </div>
  );
};

export default ProductReview;
