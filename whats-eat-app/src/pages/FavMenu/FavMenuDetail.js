import axios from "axios";
import { Col, Row } from "antd";
import FavMenuCard from "../../components/FavMenuCard/FavMenuCard";
import React, { useEffect, useState, useContext } from "react";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import './ModalMenu.css'
import './FavMenu.css'
import FavMenuSingle from "../FavMenu/FavMenuSingle";
const FavMenuDetail = (isModalVisible, handleCancel) => {

    const [menuDetail, setMenuDetail] = useState([]);
    const location = useLocation();
    const menuId = location.state.menuId;
    const token = useSelector((state) => state.auth.userInfo.token);
    useEffect(()=> {
    axios({
        method: "GET",
        url: `${process.env.REACT_APP_ASP_API_KEY}/api/Menu/${menuId}`,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          //TODO: handle logic set total like
          const result = res.data;
          setMenuDetail(result);
        })
        .catch((err) => {
        });
    }, [])
  return (
    <div className="top-items-container">
      {menuDetail.length > 0 && (
        <div className="top-items">
          <h2 className="title" style={{fontSize:"30px"}}>Menu yêu thích của bạn</h2>
          <Row gutter={[16, 24]}>
            {menuDetail.map((item) => {
              const {
                menuId,
                name,
                thumbnailUrl,
                totalLike,
                totalView,
                recipeId,
                totalTime,
                level,
                calories,
              } = item;
              return (
                <Col span={6} className="item-col" key={menuId}>
                  <FavMenuSingle {...item} />
                </Col>
              );
            })}
          </Row>
          
        </div>
        
      )}
     
    </div>
  );
    
}
export default FavMenuDetail;