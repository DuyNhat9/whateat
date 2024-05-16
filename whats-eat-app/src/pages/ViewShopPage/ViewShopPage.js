import { Col, Row, Tabs } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { BsFillPeopleFill, BsFillStarFill, BsShopWindow } from "react-icons/bs";
import { GiStabbedNote } from "react-icons/gi";
import Product from "../../components/Product/Product";
import Pagination from "../../components/Pagination/Pagination";
import Footer from "../../components/Footer/Footer";
import "./ViewShopPage.css";

const { TabPane } = Tabs;

const ViewShopPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [shopInfo, setShopInfo] = useState({});
  const [shopCate, setShopCate] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [productsByCate, setProductsByCate] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const location = useLocation();
  const storeId = location.state.storeId;
  const token = useSelector((state) => state.auth.userInfo.token);

  const getShopInfo = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/${storeId}`,
    })
      .then((res) => {
        const result = res.data;
        setShopInfo(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getShopCategories = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/storeCategories/${storeId}`,
    })
      .then((res) => {
        const result = res.data;
        console.log({ result });
        setShopCate(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getShopProducts = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/${storeId}/products?PageNumber=${pageNumber}&PageSize=30`,
    })
      .then((res) => {
        const result = res.data;
        setShopProducts(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const postLikeShop = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/like/${storeId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteLikeShop = () => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/dislike/${storeId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  const getLikeShop = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/is-like/${storeId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("is like:", res.data);
        setIsLiked(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTabClick = (key) => {
    if (key === 1) {
      return;
    } else {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_ASP_API_KEY}/api/Product?productCategories=${key}&PageNumber=${pageNumber}&PageSize=30`,
      })
        .then((res) => {
          setProductsByCate(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleClickNext = () => {
    setPageNumber((pageNumber) => pageNumber + 1);
  };
  const handleClickPrev = () => {
    setPageNumber((pageNumber) => pageNumber - 1);
  };
  useEffect(() => {
    getShopInfo();
    getShopCategories();
  }, []);

  useEffect(() => {
    getShopProducts();
  }, [pageNumber]);

  useEffect(() => {
    getLikeShop();
  }, []);

  useEffect(() => {
    if (isLiked) {
      postLikeShop();
    } else deleteLikeShop();
  }, [isLiked]);

  return (
    <div className="view-shop">
      <div className="view-shop-fluid">
        <div className="view-shop-container">
          <div className="shop-info-block">
            <div className="shop-img">
              <div className="img-box">
                <img
                  src={shopInfo.avatarUrl || ""}
                  alt={shopInfo.shopName}
                  className="avt-img"
                />
                <h2 className="shop-name">{shopInfo.shopName}</h2>
              </div>
              <div className="btn-box">
                <button className="btn" onClick={() => setIsLiked(!isLiked)}>
                  {isLiked ? "Hủy theo dõi" : "Theo dõi"}
                </button>
                <button className="btn">chat</button>
              </div>
            </div>
            <div className="shop-info">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <BsShopWindow className="icon" />
                  Sản Phẩm: <span>78</span>
                </Col>
                <Col span={12}>
                  <BsFillPeopleFill className="icon" />
                  Người Theo Dõi: <span>1k</span>
                </Col>
                <Col span={12}>
                  <BsFillStarFill className="icon" />
                  Đánh Giá: <span>4.8</span>
                </Col>
                <Col span={12}>
                  <GiStabbedNote className="icon" />
                  Tỉ Lệ Hủy Đơn Của Shop: <span>3%</span>
                </Col>
              </Row>
            </div>
          </div>
          <div className="shop-products">
            <Tabs defaultActiveKey="1" onTabClick={handleTabClick}>
              <TabPane tab="TẤT CẢ SẢN PHẨM" key="1">
                <Row gutter={[16, 16]}>
                  {shopProducts.map((item) => {
                    const {
                      productId,
                      name,
                      basePrice,
                      weightServing,
                      images,
                    } = item;
                    return (
                      <Col span={4} className="item-col" key={productId}>
                        <Product {...item} />
                      </Col>
                    );
                  })}
                </Row>
              </TabPane>
              {shopCate.map((cate, idx) => {
                return (
                  <TabPane tab={cate.name} key={idx + 2}>
                    <Row gutter={[16, 16]}>
                      {productsByCate.map((item) => {
                        const {
                          productId,
                          name,
                          basePrice,
                          weightServing,
                          images,
                        } = item;
                        return (
                          <Col span={4} className="item-col" key={productId}>
                            <Product {...item} />
                          </Col>
                        );
                      })}
                    </Row>
                  </TabPane>
                );
              })}
            </Tabs>
          </div>
          {shopProducts.length === 30 && productsByCate.length === 30 && (
            <Pagination
              onClickNext={handleClickNext}
              onClickPrev={handleClickPrev}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewShopPage;
