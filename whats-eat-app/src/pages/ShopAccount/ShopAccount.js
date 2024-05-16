import { Space, Table } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import "./ShopAccount.css";

const columns = [
  {
    title: "Mục",
    dataIndex: "cate",
    key: "cate",
  },
  {
    title: "Thông tin",
    dataIndex: "info",
    key: "info",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
    key: "action",
  },
];

const data = [
  {
    key: 1,
    cate: "Hồ sơ của tôi",
    info: "lyquynhtram",
    action: (
      <Space size="middle">
        <a>Sửa</a>
      </Space>
    ),
  },
  {
    key: 2,
    cate: "Số điện thoại",
    info: "0908986327",
    action: (
      <Space size="middle">
        <a>Sửa</a>
      </Space>
    ),
  },
  {
    key: 3,
    cate: "Email",
    info: "qtram.ly@gmail.com",
    action: (
      <Space size="middle">
        <a>Sửa</a>
      </Space>
    ),
  },
  {
    key: 4,
    cate: "Mật khẩu đăng nhập",
    info: "********",
    action: (
      <Space size="middle">
        <a>Cập nhật</a>
      </Space>
    ),
  },
  {
    key: 5,
    cate: "Liên kết tài khoản phụ",
    info: "Không được thiết lập",
    action: (
      <Space size="middle">
        <a>Sửa</a>
      </Space>
    ),
  },
];

const ShopAccount = () => {
  const location = useLocation();
  const storeId = location.state.storeId;
  return (
    <div className="shop-account">
      <div className="shop-account-fluid">
        <div className="shop-account-container">
          <ShopSidebar storeId={storeId} />
          <div className="content-container">
            <div className="shop-account-nav">
              <div>
                <h1 className="title">Tài khoản</h1>
                <p className="note">Thay đổi thiết lập cơ bản</p>
              </div>
            </div>
            <div className="account-table">
              <Table columns={columns} dataSource={data} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopAccount;
