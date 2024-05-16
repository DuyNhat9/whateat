import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Rate } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./OrderDetail.css";

const CusOrderItem = ({ productId, price, ratingAvailable }) => {
  const [orderInfo, setOrderInfo] = useState();
  const [store, setStore] = useState();
  const [isRating, setIsRating] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [rateValue, setRateValue] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.userInfo.token);

  const getStore = () => {
    if (orderInfo) {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/${
          orderInfo.storeId || 1
        }`,
      })
        .then((res) => {
          const result = res.data;
          setStore(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleReviewProduct = () => {
    console.log({ productId, rateValue, comment });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Product/review`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        productId: productId,
        rating: rateValue,
        comment: comment,
      },
    })
      .then((res) => {
        message.success("Cảm ơn đánh giá của bạn!");
        setIsRating(false);
        setIsRated(true);
      })
      .catch((err) => {
        message.error("Đánh giá không thành công!");
        setIsRating(false);
      });
  };
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Product/${productId}`,
    })
      .then((res) => {
        const result = res.data;
        setOrderInfo(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!store) getStore();

  if (!orderInfo || !store) return <p>Loading</p>;

  return (
    <>
      <div
        className="shop-name"
        style={{ cursor: "pointer" }}
        onClick={() =>
          navigate(`/viewshop/${store.storeId}`, {
            state: {
              storeId: store.storeId,
            },
          })
        }
      >
        {store.shopName}{" "}
      </div>
      <div className="order-block">
        <div className="item-info">
          <img
            className="item-img"
            src={orderInfo.images[0][0].url || ""}
            alt={orderInfo.name || "default name"}
          />
          <h3>{orderInfo.name || "default name"}</h3>
        </div>
        <h3 className="price">
          {price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </h3>

        {ratingAvailable && (
          <button
            className={`rating-btn${isRated ? " disable" : ""}`}
            disabled={isRated ? true : false}
            onClick={() => setIsRating(true)}
          >
            {isRated ? "Đã đánh giá" : "Đánh giá sản phẩm"}
          </button>
        )}
        <Modal
          title={`Đánh giá sản phẩm ${orderInfo.name ? orderInfo.name : ""}`}
          visible={isRating}
          cancelText="Hủy"
          okText="Đánh giá"
          onOk={handleReviewProduct}
          onCancel={() => setIsRating(false)}
        >
          <Rate
            className="stars"
            onChange={(value) => setRateValue(value)}
            value={rateValue}
          />
          <div className="comment-area">
            <textarea
              cols="30"
              rows="10"
              placeholder="Viết bình luận..."
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CusOrderItem;
