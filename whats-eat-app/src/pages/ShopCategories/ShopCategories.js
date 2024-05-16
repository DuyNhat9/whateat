import { Space, Table } from "antd";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import Footer from "../../components/Footer/Footer";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import "./ShopCategories.css";

const ShopCategories = () => {
  const location = useLocation();
  const storeId = location.state.storeId;
  const [shopCate, setShopCate] = useState();
  const navigate = useNavigate();
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "productCategoryId",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (item) => (
        <Space size="middle">
          <a
            onClick={() =>
              navigate(`/category/${item.productCategoryId}`, {
                state: {
                  categoryId: item.productCategoryId,
                  categoryName: item.name,
                },
              })
            }
          >
            Xem chi tiết
          </a>
        </Space>
      ),
    },
  ];
  useEffect(() => {
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
  }, []);

  return (
    <div className="shop-categories">
      <div className="shop-categories-fluid">
        <div className="shop-categories-container">
          <ShopSidebar storeId={storeId} />
          <div className="content-container">
            <div className="shop-category-nav">
              <h1 className="title">Danh mục của shop</h1>
              <div className="btn-group">
                <button className="btn preview-btn">
                  <AiOutlineEye /> <span>Xem trước</span>
                </button>
                <button className="btn add-btn">
                  <AiOutlinePlus /> <span>Thêm danh mục</span>
                </button>
              </div>
            </div>
            <div className="categories-table">
              <Table columns={columns} dataSource={shopCate} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopCategories;
