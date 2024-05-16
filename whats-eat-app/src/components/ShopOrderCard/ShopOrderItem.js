import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShopOrderItem.css";
import { Link, useLocation } from "react-router-dom";

const ShopOrderItem = ({ productId, price, value, status, id }) => {
  const [orderInfo, setOrderInfo] = useState();

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

  if (!orderInfo) return <p>Loading</p>;
  return (
    <div className="shop-order-item">
      <div className="order-info">
        <div className="product-info">
          <img
            src={orderInfo.images[0][0].url || ""}
            alt={orderInfo.name || "default name"}
          />
          <span>{orderInfo.name || "default name"}</span>
        </div>
        <p className="total-money">
          {price &&
            price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
        </p>
        <p className="status" style={{ fontWeight: 650 }}>
          {status === "Đã giao"
            ? status
            : status[status.length - 1].orderStatus.value === "waiting"
            ? "Chờ xác nhận"
            : status[status.length - 1].orderStatus.value === "delivering"
            ? "Đang giao hàng"
            : status[status.length - 1].orderStatus.value === "canceled"
            ? "Đã hủy"
            : "Đã giao hàng"}
        </p>
        <p className="delivery">{value}</p>
      </div>
      {/* <Link to={`/orders/${id}`}>Xem chi tiết...</Link> */}
    </div>
  );
};

export default ShopOrderItem;
