import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import React, { useState } from "react";
import {
  AiOutlineLogout,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineShop,
} from "react-icons/ai";
import {
  BsFillCartFill,
  BsFillPersonFill,
  BsFillSuitHeartFill,
  BsMenuButtonWideFill,
  BsPersonCircle,
  BsPlusSquare,
  BsShop,
  BsShopWindow,
} from "react-icons/bs";
import { FaPizzaSlice } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css";

const handleLogout = () => {
  localStorage.removeItem("persist:root");
};

const Navbar = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.userInfo.token);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };
  let role = "guest";
  if (token !== null) {
    role = parseJwt(token).role;
  }
  console.log(parseJwt(token));
  const handleSearch = () => {
    setSearchTerm("");
    if (searchTerm) {
      navigate(`/search?searchTerm=${searchTerm}`);
    } else return;
  };

  const options = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/profile" className="single-option">
          {" "}
          <BsPersonCircle /> <span>Trang cá nhân</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/addrecipe" className="single-option">
          <BsPlusSquare /> <span>Thêm công thức của bạn</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/fav/recipe" className="single-option">
          <BsFillSuitHeartFill /> <span>Công thức yêu thích</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/fav/menu" className="single-option">
          <BsMenuButtonWideFill />
          <span> Menu của tôi</span>
        </Link>
      </Menu.Item>
      {(role !== "store" || role === "guest") && (
        <Menu.Item key="4">
          <Link to="/orders" className="single-option">
            <BsFillCartFill /> <span>Đơn hàng</span>
          </Link>
        </Menu.Item>
      )}

      {/* <Menu.Item key="5">
        <a href="/favorshop" className="single-option">
          <BsShop /> <span>Shop yêu thích</span>
        </a>
      </Menu.Item> */}
      {(role === "store" || role === "guest") && (
        <Menu.Item key="6">
          <Link to="/shop" className="single-option">
            <BsShopWindow /> <span>Kênh người bán</span>
          </Link>
        </Menu.Item>
      )}

      <Menu.Item key="7">
        <a href="/" className="single-option" onClick={handleLogout}>
          <AiOutlineLogout /> <span>Đăng xuất</span>
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <div className="logo-and-search">
        <Link to="/" className="logo">
          WhatsEat
        </Link>
        <div className="search">
          <AiOutlineSearch className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Bạn muốn tìm gì vậy?"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                return handleSearch();
              }
            }}
          />
        </div>
        <div className="btn search-btn" onClick={handleSearch}>
          <p>Tìm kiếm</p>
        </div>
      </div>
      <div className="options">
        <Link to="/recommender" className="btn option-btn">
          <FaPizzaSlice className="option-icon" /> <span>Hôm nay ăn gì?</span>
        </Link>
        <Link to="/cart" className="btn option-btn">
          <AiOutlineShoppingCart className="option-icon" />{" "}
          <span>Giỏ hàng</span>
          <span>
            {" "}
            {props.auth.userInfo.userName && props.cart.length > 0
              ? `(${props.cart.length})`
              : ``}
          </span>
        </Link>
        <Link to="/shop/profile" className="btn option-btn">
          <AiOutlineShop className="option-icon" /> <span>Quản lý Shop</span>
        </Link>
        {props.auth.userInfo.userName ? (
          <div className="btn option-btn">
            <BsFillPersonFill className="option-icon" />
            <Dropdown
              className="option-dropdown"
              overlay={options}
              trigger={["click"]}
            >
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                {props.auth.userInfo.userName} <DownOutlined />
              </a>
            </Dropdown>
          </div>
        ) : (
          <Link to="/login" className="btn option-btn">
            <BsFillPersonFill className="option-icon" /> <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
