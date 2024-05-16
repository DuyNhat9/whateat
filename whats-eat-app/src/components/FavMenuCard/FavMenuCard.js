import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./FavMenuCard.css";
import {Button} from "antd";
import { useNavigate } from "react-router-dom";
const FavMenuCard = ({ }) => {
  const [data, setData] = useState([]);
  const token = useSelector((state) => state.auth.userInfo.token);
  const navigate = useNavigate();
  useEffect(()=> {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Menu`,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((res) => {
      setData(res.data);
      console.log("data",res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [])
  return (
    <div style={{display:'flex',flexDirection:'row',gap:'50px'}}>
      {data.map(item =><div className="fav-menu-card">
     <h2><strong>{item.menuName}</strong></h2>
     <Button onClick={() =>
        navigate(`/fav/menu/${item.menuId}`, {
          state: {
            menuId: item.menuId,
          },
        })
      } type="primary" size={12}>Xem chi tiết</Button>
     </div> )}
     
    </div>
    
  );
};

export default FavMenuCard;
