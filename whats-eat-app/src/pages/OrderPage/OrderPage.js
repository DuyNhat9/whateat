import { Tabs } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer/Footer";
import AppContext from "../../context/AppContext";
import Order from "../../components/Order/Order";
import "./OrderPage.css";

const { TabPane } = Tabs;

const OrderPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allOrders, setAllOrders] = useState([]);
  const token = useSelector((state) => state.auth.userInfo.token);
  const { triggerReload } = useContext(AppContext);

  const allUserOrders = {
    waiting: [],
    delivering: [],
    delivered: [],
    cancel: [],
  };

  allOrders.length > 0 &&
    allOrders.map((order) => {
      if (order.orderStatusHistories.length < 1) return;
      switch (
        order.orderStatusHistories[order.orderStatusHistories.length - 1]
          .orderStatus.value
      ) {
        case "waiting":
          allUserOrders.waiting.push(order);
          break;
        case "delivering":
          allUserOrders.delivering.push(order);
          break;
        case "delivered":
          allUserOrders.delivered.push(order);
          break;
        case "canceled":
          allUserOrders.cancel.push(order);
          break;
        default:
          allUserOrders.delivered.push(order);
      }
    });
  const getCustomerOrders = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/orders-list?PageNumber=${pageNumber}&PageSize=${pageSize}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const result = res.data;
        console.log({ result });
        setAllOrders(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCustomerOrders();
  }, [triggerReload]);

  return (
    <div className="orders">
      <div className="orders-fluid">
        <div className="orders-container">
          <h1 className="title" style={{ fontWeight: "650" }}>
            Đơn hàng của tôi
          </h1>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tất cả đơn" key="1">
              {allOrders.length > 0 ? (
                allOrders.map((order) => {
                  return <Order key={order.orderId} {...order} />;
                })
              ) : (
                <p>Bạn chưa có đơn hàng nào!</p>
              )}
            </TabPane>
            <TabPane tab="Đang chờ xác nhận" key="2">
              {allUserOrders.waiting.length > 0 ? (
                allUserOrders.waiting.map((order) => {
                  return <Order key={order.orderId} {...order} />;
                })
              ) : (
                <p>Bạn chưa có đơn hàng đang chờ xác nhận nào!</p>
              )}
            </TabPane>

            <TabPane tab="Đang vận chuyển" key="3">
              {allUserOrders.delivering.length > 0 ? (
                allUserOrders.delivering.map((order) => {
                  console.log();
                  return <Order key={order.orderId} {...order} />;
                })
              ) : (
                <p>Bạn chưa có đơn hàng đang vận chuyển nào!</p>
              )}
            </TabPane>
            <TabPane tab="Đã giao" key="4">
              {allUserOrders.delivered.length > 0 ? (
                allUserOrders.delivered.map((order) => {
                  return <Order key={order.orderId} {...order} />;
                })
              ) : (
                <p>Bạn chưa có đơn hàng đã giao nào!</p>
              )}
            </TabPane>
            <TabPane tab="Đã hủy" key="5">
              {allUserOrders.cancel.length > 0 ? (
                allUserOrders.cancel.map((order) => {
                  return <Order key={order.orderId} {...order} />;
                })
              ) : (
                <p>Bạn chưa có đơn hàng đã hủy nào!</p>
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderPage;
