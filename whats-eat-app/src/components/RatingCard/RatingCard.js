import React from "react";
import "./RatingCard.css";
import StarRatings from "react-star-ratings";
const RatingCard = ({
  productReviewId,
  rating,
  createdOn,
  comment,
  product,
  customer,
}) => {
  const photos = JSON.parse(product.photoJson);
  return (
    <div className="rating-card">
      <div className="rating-card-nav">
        <p>Người mua: {customer.name ? customer.name : "NhatHiepisme"}</p>
        <p>ID đơn hàng: {productReviewId}</p>
      </div>
      <div className="rating-info">
        <div className="product-info">
          <div className="img-box">
            <img src={photos[0][0].url} alt="whatseat" />
          </div>
          <p className="item-name">{product.name}</p>
        </div>
        <div className="rating-content">
          <div className="star-box">
            <StarRatings
              rating={rating}
              starRatedColor="brown"
              numberOfStars={5}
              name="rating"
              starDimension="25px"
              starSpacing="3px"
            />
          </div>
          <div className="content-box">{comment}</div>
          <div className="img-box"></div>
          <p className="rate-time">{createdOn}</p>
        </div>
        <div className="shop-reply">
          <p className="reply-content">Thank you so much</p>
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
