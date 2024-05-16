import React, { useState, useEffect } from "react";
import "./Dish.css";

import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "../../reducers/cart";
import { Modal } from "antd";
import axios from "axios";
import {
  AiFillHeart,
  AiOutlineClockCircle,
  AiFillThunderbolt,
  AiOutlineBarChart,
  AiFillPlusCircle,
  AiOutlineUnorderedList,
  AiOutlineShoppingCart,
} from "react-icons/ai";

let a = [];

const DishRecommended = (props) => {
  const {recipeId,
    name,
    totalTime,
    totalView,
    level,
    images,
    calories,
    isShowRecipe,
    addRecipe,
    } = props
  const [isLikeRecipe, setIsLikeRecipe] = useState(false);
  const { token, userName } = useSelector((state) => state.auth.userInfo);
  const price= 230000;
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.userInfo);
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
  const addToCart = (e) => {
    e.stopPropagation();
    if (auth.userName) {
      dispatch(addItemToCart({ productId: recipeId,productDetail: {
        productId: recipeId,
        name: name,
        basePrice: 230000,
        images:[images],
       },count }));
      let secondsToGo = 0.5;
      const modal = Modal.success({
        title: "Sản phẩm đã được thêm vào giỏ hàng",
        okButtonProps: {
          disabled: true,
          className: "modal-footer-hiden-button",
        },
      });
      const timer = setInterval(() => {
        secondsToGo -= 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        modal.destroy();
      }, secondsToGo * 1000);
    } else {
      navigate(`/login`);
    }
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
      <div className="test" >  
      {/* <div className="add-icon" onClick={addRecipeToMenu}> */}
      <div className="add-icon" onClick={addRecipeToMenu}>
          <AiFillPlusCircle className="icon" />
        </div>
        <div className="sell-icon" onClick={addToCart}>
        <AiOutlineShoppingCart className="icon" />
        </div>
        
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
        <div className="info-detail">
          <div>
            <AiOutlineUnorderedList className="icon" /> <span>{calories}</span>{" "}
            xem
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishRecommended;
