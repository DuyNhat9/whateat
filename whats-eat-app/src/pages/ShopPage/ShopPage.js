import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import { useSelector } from "react-redux";
import Shop from "../../components/Shop/Shop";
import "./ShopPage.css";

const ShopPage = () => {
  const [listShop, setListShop] = useState();
  const [isRegistered, setIsRegistered] = useState(true);
  const token = useSelector((state) => state.auth.userInfo.token);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/myStores`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data.length > 0) {
          setIsRegistered(true);
          setListShop(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="shop">
      <div className="shop-fluid">
        {isRegistered ? (
          <Shop storeId={listShop ? listShop[0]?.storeId : 1} />
        ) : (
          <div className="shop-container">
            <h1 className="title-container">
              Đăng ký trở thành Người bán WhatsEat
            </h1>
            <div className="content">
              <img
                className="not-register-img"
                src="https://deo.shopeesz.com/shopee/pap-admin-live-sg/upload/upload_9dab85081088531ee6d1aa958a90f55e.png"
                alt="intro"
              />
              <h2 className="title">Chào mừng đến WhatsEat</h2>
              <p>
                Để đăng ký bán hàng trên WhatsEat, bạn cần cung cấp một số thông
                tin cơ bản.
              </p>
              <Link to="/shop/register" className="register-btn">
                Đăng ký
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;
