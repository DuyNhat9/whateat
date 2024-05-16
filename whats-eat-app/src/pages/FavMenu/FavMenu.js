import { Col, Row } from "antd";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsFillPersonFill } from "react-icons/bs";
import FavMenuCard from "../../components/FavMenuCard/FavMenuCard";
import Footer from "../../components/Footer/Footer";
import { getCurrentDate } from "../../utils/GetDate";
import "./FavMenu.css";
const FavMenu = () => {
  const [user, setUser] = useState();
  const token = useSelector((state) => state.auth.userInfo.token);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (!user) return <></>;

  const [userId] = user.customerId.split("-");
  return (
    <div className="fav-menu">
      <div className="fav-menu-fluid">
        <div className="fav-menu-container">
          <div className="profile">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" />
            ) : (
              <BsFillPersonFill className="img-avt" />
            )}
            <p className="username">
              {user.name ? user.name : `user${userId}`}
            </p>
            <h1>Thực Đơn Yêu Thích</h1>
            <p className="date-update">cập nhật ngày {getCurrentDate()}</p>
          </div>
          <div className="more-menu">
            <button>Thêm gợi ý thực đơn...</button>
          </div>
          <Row gutter={[16, 16]}>
            {recommendedMenu.map((menu) => (
              <Col span={50} className="dish-col">
                <FavMenuCard  />
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavMenu;

const recommendedMenu = [
  {
    id: 1,
    menu: [
      {
        id: 1,
        dish_name: "Ba Chỉ Rim Tôm Khô",
      },
      {
        id: 2,
        dish_name: "Củ kiệu ngâm chanh dây",
      },
      {
        id: 3,
        dish_name: "Trà vải tươi",
      },
    ],
  },
];
