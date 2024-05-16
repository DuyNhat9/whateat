import { Space, Table } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Footer from "../../components/Footer/Footer";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import "./ShopAddress.css";

const columns = [
  {
    title: "Họ và tên",
    dataIndex: "shopname",
    key: "shopname",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phonenumber",
    key: "phonenumber",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    key: "note",
  },
  {
    title: "Thao tác",
    render: (text) => (
      <Space size="middle">
        <a>Sửa</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: 1,
    shopname: "Trần Nhật Hiệp",
    phonenumber: "0123456789",
    address: "Tân Bình, TP.HCM",
    note: "Địa chỉ mặc định",
  },
  {
    key: 2,
    shopname: "Lý Quỳnh Trâm",
    phonenumber: "0908986327",
    address: "Tân Thới Nhất, Quận 12, TP.HCM",
    note: (
      <Space size="middle">
        <a>Xóa</a>
      </Space>
    ),
  },
  {
    key: 3,
    shopname: "Lý Quỳnh Trâm",
    phonenumber: "0869112549",
    address: "Đức Chánh, Mộ Đức, Quảng Ngãi",
    note: (
      <Space size="middle">
        <a>Xóa</a>
      </Space>
    ),
  },
];

const ShopAddress = () => {
  return (
    <div className="shop-address">
      <div className="shop-address-fluid">
        <div className="shop-address-container">
          <ShopSidebar />
          <div className="content-container">
            <div className="shop-address-nav">
              <h1 className="title">Địa chỉ</h1>
              <div className="btn-group">
                <button className="btn add-btn">
                  <AiOutlinePlus /> <span>Thêm địa chỉ</span>
                </button>
              </div>
            </div>
            <p className="note">Quản lý địa chỉ giao hàng của bạn</p>
            <div className="address-table">
              <Table columns={columns} dataSource={data} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopAddress;
