import { message, Rate, Timeline } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CusOrderItem from "./CusOrderItem";
import Footer from "../../components/Footer/Footer";
import "./OrderDetail.css";

const CusOrderDetail = () => {
  const { id } = useParams();
  const [isCancel, setIsCancel] = useState(false);
  const [order, setOrder] = useState(null);
  const token = useSelector((state) => state.auth.userInfo.token);

  const getOrder = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/order/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const result = res.data;
        console.log(result);
        setOrder(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelOrder = () => {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/order`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        orderId: order.orderId,
        message: ".",
      },
    })
      .then((res) => {
        setIsCancel(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getOrder();
  }, []);

  let total = 0;
  if (!order)
    return (
      <div
        style={{
          height: "85vh",
          display: "flex",
          alignItem: "center",
          justifyContent: "center",
          fontSize: "3rem",
          fontWeight: "900",
          marginTop: "15rem",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  else {
    if (order.orderDetails !== null) {
      order.orderDetails &&
        order.orderDetails.map((item) => (total += item.price));
    }
  }

  return (
    <div className="order-detail">
      <div className="order-detail-fluid">
        <div className="order-detail-container">
          <h1 className="title" style={{ fontWeight: "650" }}>
            Chi tiết đơn hàng
          </h1>
          <div className="order-info">
            <div className="address-and-status">
              <div className="address">
                <h2>Địa Chỉ Nhận Hàng</h2>
                <p className="customer-name">
                  {order.shippingInfo.name
                    ? order.shippingInfo.name
                    : "Trần Nhật Hiệp"}
                </p>
                <p className="phone-number">
                  {order.shippingInfo
                    ? order.shippingInfo.phoneNumber
                    : "0984523175"}
                </p>
                <p className="address">
                  {order.shippingInfo
                    ? order.shippingInfo.address
                    : "Default address"}
                </p>
              </div>
              <div className="status">
                <p className="order-id">Mã đơn hàng: {order.orderId}</p>
                <Timeline>
                  {order.orderStatusHistories.length > 0 ? (
                    order.orderStatusHistories.map((status) => {
                      switch (status.orderStatus.value) {
                        case "waiting":
                          return <Timeline.Item>Chờ xác nhận</Timeline.Item>;
                          break;
                        case "delivering":
                          return <Timeline.Item>Đang giao hàng</Timeline.Item>;
                          break;
                        case "delivered":
                          return <Timeline.Item>Đã giao hàng</Timeline.Item>;
                          break;
                        case "canceled":
                          return <Timeline.Item>Đơn hủy</Timeline.Item>;
                          break;

                        default:
                          return <></>;
                      }
                    })
                  ) : (
                    <>
                      <Timeline.Item>Chờ xác nhận</Timeline.Item>
                      <Timeline.Item>Đang giao hàng</Timeline.Item>
                      <Timeline.Item>Đã giao hàng</Timeline.Item>
                    </>
                  )}
                </Timeline>
              </div>
            </div>
            <div className="detail">
              <div className="item-info">
                {order.orderDetails.length > 0 &&
                  order.orderDetails.map((item, idx) => (
                    <CusOrderItem
                      key={idx}
                      {...item}
                      ratingAvailable={
                        order.orderStatusHistories.length > 0 &&
                        order.orderStatusHistories[
                          order.orderStatusHistories.length - 1
                        ].orderStatus.value === "delivered"
                      }
                    />
                  ))}
                <div className="payment-info">
                  <div className="label">
                    <p>Tổng tiền hàng</p>
                    <p>Phí vận chuyển</p>
                    <p>Tổng số tiền</p>
                  </div>
                  <div className="value">
                    <p>
                      {total.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p>
                      {order.shippingFee
                        ? order.shippingFee.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                        : (30000).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                    </p>
                    <p>
                      {order.shippingFee
                        ? (total + order.shippingFee).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                        : (total + 30000).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-info-block"></div>
            </div>
          </div>
          {order.orderStatusHistories.length > 0 &&
          order.orderStatusHistories[order.orderStatusHistories.length - 1]
            .orderStatus.value === "waiting" ? (
            <button className="btn cancel-btn" onClick={handleCancelOrder}>
              {isCancel ? "Đã hủy đơn" : "Hủy đơn hàng"}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CusOrderDetail;

const mock_order = {
  id: 0,
  shop_name: "DONAFARM",
  item_name: "Gà Ta Bình Định Thả Vườn",
  img_url:
    "https://image.cooky.vn/posproduct/g0/6997/s/8f099d38-a334-4315-8be3-5c4a3ead7ee2.jpeg",
  price: 169000,
  quantity: "500g",
  status: 0,
};
