import { Col, Row } from "antd";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsFillPersonFill } from "react-icons/bs";
import FavDishCard from "../../components/FavDishCard/FavDishCard";
import Footer from "../../components/Footer/Footer";
import { getCurrentDate } from "../../utils/GetDate";
import "./FavRecipe.css";

const FavRecipe = () => {
  const [user, setUser] = useState();
  const [listRecipes, setListRecipes] = useState([]);
  const token = useSelector((state) => state.auth.userInfo.token);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${
        process.env.REACT_APP_ASP_API_KEY
      }/api/Recipe/love?PageNumber=${1}&PageSize=${30}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setListRecipes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
    <div className="fav-recipe">
      <div className="fav-recipe-fluid">
        <div className="fav-recipe-container">
          <div className="profile">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" />
            ) : (
              <BsFillPersonFill className="img-avt" />
            )}
            <p className="username">
              {user.name ? user.name : `user${userId}`}
            </p>
            <h1>Công Thức Yêu Thích</h1>
            <p className="date-update">cập nhật ngày {getCurrentDate()}</p>
          </div>
          <div className="more-recipe">
            <button>Thêm gợi ý công thức...</button>
          </div>
          <Row gutter={[16, 16]}>
            {listRecipes.map((recipe) => {
              const {
                recipeId,
                images,
                name,
                totalLike,
                totalTime,
                level,
                totalView,
              } = recipe;
              return (
                <Col span={6} key={recipeId} className="dish-col">
                  <FavDishCard {...recipe} />
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavRecipe;
