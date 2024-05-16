import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import {AiOutlineShoppingCart} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer/Footer";
import "../../components/Dish/Dish.css"
import {
  AiFillHeart,
  AiOutlineClockCircle,
  AiFillThunderbolt,
  AiOutlineBarChart,
  AiFillPlusCircle,
  AiOutlineUnorderedList,
} from "react-icons/ai";

const FavMenuSingle = (item) => {
    const {menuId,name,thumbnailUrl,recipeId,totalTime,totalLike,totalView,calories,level} = item;
    const navigate = useNavigate();
    console.log("value",item);
    const images = JSON.parse(thumbnailUrl);
    return (
      <div
        className="dish-container"
        onClick={() =>
          navigate(`/singledish/${recipeId}`, {
            state: {
              recipeId: recipeId,
            },
          })
        }
      >
        <img src={images[0][0].url? images[0][0].url: ""} alt={name} className="dish-img" />
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
          <div className="info-detail">
            <div>
              <AiOutlineUnorderedList className="icon" /> <span>{totalLike}</span>{" "}
              Lượt thích
            </div>
          </div>
        </div>
      </div>
      
    );
};


export default FavMenuSingle;