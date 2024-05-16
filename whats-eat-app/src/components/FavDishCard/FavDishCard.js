import React from "react";
import "./FavDishCard.css";
import {
  AiFillHeart,
  AiOutlineClockCircle,
  AiFillThunderbolt,
  AiOutlineBarChart,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const FavDishCard = ({
  recipeId,
  images,
  name,
  totalLike,
  totalTime,
  level,
  totalView,
}) => {
  const navigate = useNavigate();

  if (!images) {
    return <img src="../../assets/Banner/preloader.gif" alt="" />;
  }
  return (
    <div
      className="fav-dish-card"
      onClick={() =>
        navigate(`/singledish/${recipeId}`, {
          state: {
            recipeId: recipeId,
          },
        })
      }
    >
      <img src={images[0].url} alt={name} className="dish-img" />
      <div className="heart-icon">
        <AiFillHeart className="icon" style={{ color: "red" }} />
      </div>
      <h3 className="dish-name">{name}</h3>
      <div className="dish-info">
        <div className="info-detail">
          <div>
            <AiOutlineClockCircle className="icon" /> <span>{totalTime}</span>
          </div>
        </div>
        <div className="info-detail">
          <div>
            <AiFillThunderbolt className="icon" /> <span>{level || "Dễ"}</span>
          </div>
        </div>
        <div className="info-detail">
          <div>
            <AiOutlineBarChart className="icon" /> <span>{totalView}</span> xem
          </div>
        </div>
      </div>
      <p style={{ marginTop: "0.5rem" }}>Được thêm bởi: Trần Nhật Hiệp</p>
    </div>
  );
};

export default FavDishCard;
