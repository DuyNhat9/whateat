import { Space, Table } from "antd";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer/Footer";
import "./FavorShop.css";

const FavorShop = () => {
  const [shopList, setShopList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.userInfo.token);

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/followings`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setShopList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber]);

  return (
    <div className="favor-shop">
      <div className="favor-shop-fluid">
        <div className="favor-shop-container">
          <div className="content-container">
            <div className="favor-shop-nav">
              <h1 className="title">Shop yêu thích</h1>
            </div>
            <div className="favor-shop-table">
              {shopList.length > 0 ? (
                shopList.map((shop, idx) => {
                  return (
                    <div className="shop-followed-card" key={idx}>
                      <div className="shop-info">
                        <img
                          src={
                            shop.avatarUrl ||
                            "https://cf.shopee.vn/file/569ea6d6a8d2816a10d3a258e58d9ecc_tn"
                          }
                          alt="whatseat"
                        />
                        <p>{shop.shopName}</p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/viewshop/${shop.storeId}`, {
                            state: {
                              storeId: shop.storeId,
                            },
                          })
                        }
                      >
                        Xem shop
                      </button>
                    </div>
                  );
                })
              ) : (
                <h2>Bạn chưa theo dõi shop nào.</h2>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavorShop;
