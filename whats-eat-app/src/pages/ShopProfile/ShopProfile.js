import { Form, Input, message, Modal } from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import ShopList from '../../components/ShopList/ShopList';
import "./ShopProfile.css";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "Vui lòng nhập ${label}!",
  types: {
    email: "${label} không hợp lệ!",
    number: "${label} không hợp lệ!",
  },
};

const ShopProfile = () => {
  const token = useSelector((state) => state.auth.userInfo.token);

  const [stores, setStores] = useState([])

  useEffect(() => {
    axios({//need data
      method: "GET",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/get`,
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+token }
    })
    .then(resp => resp.json())
    .then(resp => setStores(resp))
    .catch(error => console.log(error))
  },[])

  const deleteStore = (store) => {
    const new_stores = stores.filter(mystore => {
      if (mystore.StoreId === store.StoreId) {
        return false;
      }
      return true
    })
    setStores(new_stores)
  }

  const onFormFinish = (values) => {
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/info`,
      headers: { Authorization: `Bearer ${token}` },
      data: values,
    })
      .then((res) => {
        message.success("Thay đổi thông tin thành công!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Thay đổi thông tin thất bại!");
      });
  };

  return (
    <div className="shop-profile">
      <div className="shop-profile-fluid">
        <div className="shop-profile-container">
          <ShopSidebar />
          <div className="content-container">
            <h1 className="title">Hồ Sơ chi tiết</h1>
            <p className="note">
              Xóa, sửa hồ sơ Shop của bạn
            </p>
            <div className = "App" >

            <ShopList stores = {stores} deleteStore ={deleteStore}/>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopProfile;
