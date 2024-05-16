import React, { useState, useEffect } from "react";
import "./Dish.css";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AiFillHeart,
  AiOutlineClockCircle,
  AiFillThunderbolt,
  AiOutlineBarChart,
  AiFillPlusCircle,
  AiOutlineShoppingCart,
} from "react-icons/ai";

const Dish = ({
  recipeId,
  name,
  totalTime,
  totalView,
  level,
  images,
  calories,
  isShowRecipe,
  addRecipe,
}) => {
  const [isLikeRecipe, setIsLikeRecipe] = useState(false);
  const { token, userName } = useSelector((state) => state.auth.userInfo);


  const navigate = useNavigate();

  const addRecipeToMenu = (e) => {
    e.stopPropagation();
    addRecipe({
      recipeId,
      name,
      totalTime,
      totalView,
      level,
      images,
      calories,
    });
  };

  const handleLikeRecipe = (e) => {
    e.stopPropagation();
    if (!userName) {
      navigate(`/login`);
    } else {
      setIsLikeRecipe(!isLikeRecipe);
      if (isLikeRecipe) {
        axios({
          method: "POST",
          url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/love/${recipeId}`,
          headers: { Authorization: `Bearer ${token}` },
          data: {
            recipeId: recipeId,
            // userName: userName,
          },
        })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios({
          method: "DELETE",
          url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/love/${recipeId}`,
          headers: { Authorization: `Bearer ${token}` },
          data: {
            recipeId: recipeId,
            // userName: userName,
          },
        })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  console.log(isLikeRecipe);
  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/love/isLoved/${recipeId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setIsLikeRecipe(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


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
      <img src={images[0].url || ""} alt={name} className="dish-img" />
      {isShowRecipe ? (
        <div className="add-icon" onClick={addRecipeToMenu}>
          <AiFillPlusCircle className="icon" />

        </div>
      ) : (
        <div
          className={`${
            isLikeRecipe ? "recipe-liked" : "recipe-not-liked"
          } heart-icon`}
          onClick={handleLikeRecipe}
        >
          <AiFillHeart className="icon" />
        </div>
      )}
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
    </div>
  );
};

export default Dish;
