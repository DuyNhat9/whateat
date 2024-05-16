import React, { useState, useContext } from "react";
import "./Comment.css";

import axios from "axios";
import { useSelector } from "react-redux";
import { message, Rate } from "antd";
import "antd/dist/antd.css";
import { AiOutlineCamera, AiFillFileImage } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import AppContext from "../../context/AppContext";

const Comment = ({ recipeId }) => {
  const [isCommented, setIsCommented] = useState(false);
  const [rateValue, setRateValue] = useState(5);
  const [comment, setComment] = useState("");
  const { token, userName } = useSelector((state) => state.auth.userInfo);
  const { triggerReload, setTriggerReload } = useContext(AppContext);

  const handleSubmitRating = (recipeId) => {
    console.log(recipeId, rateValue, comment);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/reviews`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        recipeId: recipeId,
        rating: rateValue,
        comment: comment,
      },
    })
      .then((res) => {
        message.success("Cảm ơn đánh giá của bạn!");
        setComment("");
        setTriggerReload(!triggerReload);
      })
      .catch((err) => {
        message.error("Đánh giá không thành công!");
      });
  };

  if (!isCommented) {
    return (
      <div className="comment-container">
        <h1 className="title">Bình luận</h1>
        <div
          className="comment-box"
          onClick={() => {
            if (!userName) {
              message.error("Vui lòng đăng nhập trước khi bình luận");
            } else setIsCommented(true);
          }}
        >
          <div className="comment-fluid">
            <AiOutlineCamera className="camera-icon" />
            <p>Đăng bình luận...</p>
          </div>
          <FiSend className="send-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="comment-container">
      <h1 className="title">Bình luận</h1>
      <div className="rating-area">
        <Rate
          className="stars"
          onChange={(value) => setRateValue(value)}
          value={rateValue}
        />
      </div>
      <div className="comment-area">
        <textarea
          cols="30"
          rows="10"
          placeholder="Mô tả"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <div className="submit-area">
        {/* <button className="btn img-load-btn">
          <AiFillFileImage className="img-icon" /> TẢI THÊM ẢNH
        </button> */}
        <button
          className="btn submit-btn"
          onClick={() => handleSubmitRating(recipeId)}
        >
          GỬI BÌNH LUẬN
        </button>
      </div>
    </div>
  );
};

export default Comment;
