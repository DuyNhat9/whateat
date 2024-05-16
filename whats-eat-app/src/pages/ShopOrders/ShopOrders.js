import { Tabs } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useState, useContext } from "react";
import Footer from "../../components/Footer/Footer";
import ShopOrderCard from "../../components/ShopOrderCard/ShopOrderCard";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import "./ShopOrders.css";
import AppContext from "../../context/AppContext";

const { TabPane } = Tabs;

const ShopOrders = () => {
  const [shopOrders, setShopOrders] = useState([]);
  const [orders1, setOrders1] = useState([]);
  const [orders2, setOrders2] = useState([]);
  const [orders3, setOrders3] = useState([]);
  const [orders4, setOrders4] = useState([]);
  const [product, setProduct] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [productInfo, setProductInfo] = useState();
  const [defaultActiveKey, setDefaultActiveKey] = useState("1");
  const location = useLocation();
  const { storeId, defaultKey } = location.state;
  const token = useSelector((state) => state.auth.userInfo.token);
  const { triggerReload } = useContext(AppContext);

  useEffect(() => {
    axios({//need data
      method: "GET",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/getorder`,
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+token }
    })
    .then(resp => resp.json())
    .then(resp => setShopOrders(resp))
    .catch(error => console.log(error))
  },[])

  useEffect(() => {
    axios({//need data
      method: "GET",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/getorder1`,
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setOrders1(resp))
    .catch(error => console.log(error))
  },[])

  useEffect(() => {
    axios({//need data
      method: "GET",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/getorder2`,
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setOrders2(resp))
    .catch(error => console.log(error))
  },[])

  useEffect(() => {
    axios({//need data
      method: "GET",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/getorder3`,
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setOrders3(resp))
    .catch(error => console.log(error))
  },[])

  useEffect(() => {
    axios({//need data
      method: "GET",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/getorder4`,
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setOrders4(resp))
    .catch(error => console.log(error))
  },[])

  useEffect(() => {
    axios({//need data
      method: "GET",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/sale`,
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(resp => setProduct(resp))
    .catch(error => console.log(error))
  },[])

  const allOrders = {
    waiting: [],
    delivering: [],
    delivered: [],
    cancel: [],
  };

  return (
    // <AppProvider>
    <div className="shop-orders">
      <div className="shop-orders-fluid">
        <div className="shop-orders-container">
          <ShopSidebar storeId={storeId} />
          <div className="content-container">
            <h1 className="title">Tất cả đơn hàng</h1>
            <p className="total-orders">
              Bạn đang có tất cả {shopOrders.length} đơn hàng
            </p>
            <div className="orders">
              <Tabs
                defaultActiveKey={defaultActiveKey}
                activeKey={defaultActiveKey}
                onTabClick={(key) => setDefaultActiveKey(key)}
              >
                <TabPane tab="Tất cả" key="1">
                    <tr>
                      <td><b>Sản phẩm</b></td>
                      <td><b>Tổng đơn hàng</b></td>
                      <td><b>Giá tiền</b></td>
                    </tr>
                  {shopOrders.length > 0 ? (
                    shopOrders?.map (order => {
                      return (
                        <div key = {order.OrderId}>

                            <tr>
                              <td>{order.Name}</td>
                              <td>{order.Quantity}</td>
                              <td>{order.Price}</td>
                            </tr>

                        </div>
                      )
                    })
                  ) : (
                    <p>Bạn chưa có đơn hàng nào!</p>
                  )}
                </TabPane>
                <TabPane tab="Chờ xác nhận" key="2">
                <tr>
                      <td><b>Đơn hàng</b></td>
                      <td><b>Ngày giờ</b></td>
                    </tr>
                  {orders1.length > 0 ? (
                    orders1?.map (ord1 => {
                      return (
                        <div key = {ord1.OrderStatusHistoryId}>

                            <tr>
                              <td>{ord1.OrderId}</td>
                              <td>{ord1.CreatedOn}</td>
                            </tr>

                        </div>
                      )
                    })
                  ) : (
                    <p>Bạn chưa có đơn hàng nào!</p>
                  )}
                </TabPane>
                <TabPane tab="Đang giao" key="3">
                <tr>
                      <td><b>Đơn hàng</b></td>
                      <td><b>Ngày giờ</b></td>
                    </tr>
                  {orders2.length > 0 ? (
                    orders2?.map (ord2 => {
                      return (
                        <div key = {ord2.OrderStatusHistoryId}>

                            <tr>
                              <td>{ord2.OrderId}</td>
                              <td>{ord2.CreatedOn}</td>
                            </tr>

                        </div>
                      )
                    })
                  ) : (
                    <p>Bạn chưa có đơn hàng nào!</p>
                  )}
                </TabPane>
                <TabPane tab="Đã giao" key="4">
                <tr>
                      <td><b>Đơn hàng</b></td>
                      <td><b>Ngày giờ</b></td>
                    </tr>
                  {orders3.length > 0 ? (
                    orders3?.map (ord3 => {
                      return (
                        <div key = {ord3.OrderStatusHistoryId}>

                            <tr>
                              <td>{ord3.OrderId}</td>
                              <td>{ord3.CreatedOn}</td>
                            </tr>

                        </div>
                      )
                    })
                  ) : (
                    <p>Bạn chưa có đơn hàng nào!</p>
                  )}
                </TabPane>
                <TabPane tab="Đã hủy" key="5">
                <tr>
                      <td><b>Đơn hàng</b></td>
                      <td><b>Ngày giờ</b></td>
                    </tr>
                  {orders4.length > 0 ? (
                    orders4?.map (ord4 => {
                      return (
                        <div key = {ord4.OrderStatusHistoryId}>

                            <tr>
                              <td>{ord4.OrderId}</td>
                              <td>{ord4.CreatedOn}</td>
                            </tr>

                        </div>
                      )
                    })
                  ) : (
                    <p>Bạn chưa có đơn hàng nào!</p>
                  )}
                </TabPane>
                {/* <TabPane tab="Trả hàng/hoàn tiền" key="6">
                  <div className="table-title">
                    <p className="product-name">Sản phẩm</p>
                    <p>Tổng đơn hàng</p>
                    <p></p>
                    <p>Vận chuyển</p>
                    <p>Thao tác</p>
                  </div>
                  {allOrders.repaid.length > 0 &&
                    allOrders.repaid.map((order, idx) => {
                      if (order.customer) {
                        return <ShopOrderCard key={idx} {...order} />;
                      }
                    })} */}
                {/* </TabPane> */}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    // </AppProvider>
  );
};

export default ShopOrders;
