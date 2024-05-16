import React, { useState, useEffect, useContext } from "react";
import "./Order.css";
import axios from "axios";
import { useSelector } from "react-redux";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";
import OrderItem from "./OrderItem";

const Order = ({ orderId, orderStatusHistories }) => {
  const [orderInfo, setOrderInfo] = useState();
  const [isCancel, setIsCancel] = useState(false);
  const token = useSelector((state) => state.auth.userInfo.token);
  const { triggerReload, setTriggerReload } = useContext(AppContext);

  const handleCancelOrder = () => {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/order`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        orderId: orderId,
        message: ".",
      },
    })
      .then((res) => {
        setIsCancel(true);
        setTriggerReload(!triggerReload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/order/${orderId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const result = res.data;
        setOrderInfo(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let total = 0;
  if (!orderInfo) return <p>Loading</p>;
  else {
    if (orderInfo.orderDetails !== null) {
      orderInfo.orderDetails &&
        orderInfo.orderDetails.map((item) => (total += item.price));
    }
  }

  return (
    <>
      <div className="order">
        <div className="order-container">
          <h2 className="title">
            <span>Đơn hàng: {orderId}</span>
            <Link to={`/orders/${orderId}`}>Xem chi tiết...</Link>
          </h2>
          {orderInfo.orderDetails.length > 0 &&
            orderInfo.orderDetails.map((order, idx) => (
              <OrderItem key={idx} {...order} />
            ))}

          <div className="cancel-block">
            <p>
              Trạng thái đơn hàng:{" "}
              <strong>
                {orderStatusHistories.length > 0
                  ? orderStatusHistories[orderStatusHistories.length - 1]
                      .orderStatus.value === "waiting"
                    ? "Chờ xác nhận"
                    : orderStatusHistories[orderStatusHistories.length - 1]
                        .orderStatus.value === "delivering"
                    ? "Đang giao hàng"
                    : orderStatusHistories[orderStatusHistories.length - 1]
                        .orderStatus.value === "delivered"
                    ? "Đã giao hàng"
                    : orderStatusHistories[orderStatusHistories.length - 1]
                        .orderStatus.value === "canceled"
                    ? "Đã hủy"
                    : "Đã giao hàng"
                  : "Đã giao"}
              </strong>
            </p>
          </div>
          {orderStatusHistories.length > 0 &&
          orderStatusHistories[orderStatusHistories.length - 1].orderStatus
            .value === "waiting" ? (
            <button className="btn cancel-btn" onClick={handleCancelOrder}>
              {isCancel ? "Đã hủy đơn" : "Hủy đơn hàng"}
            </button>
          ) : (
            <></>
          )}

          <div className="total">
            <p>
              Tổng số tiền:{" "}
              {(total + orderInfo.shippingFee).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
