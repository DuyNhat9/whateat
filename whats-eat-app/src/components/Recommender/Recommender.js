import React, { useState, useEffect } from "react";
import "./Recommender.css";
import { Button, Row, Col, Select, Input } from "antd";
import { useSelector } from "react-redux";
import "antd/dist/antd.css";
import axios from "axios";
import { getCurrentDate } from "../../utils/GetDate";
import { Link } from "react-router-dom";
import { BiSave,BiCart } from "react-icons/bi";
import DishBox from "../DishBox/DishBox";
import { AiFillDelete } from "react-icons/ai";
import { Progress, Pagination } from "antd";
import {Tabs} from 'antd';
const TabPane = Tabs.TabPane;
const { Option } = Select;

const Recommender = ({ kcal, menu,setCurrentPage, onFilter }) => {
  const [listRecipes, setListRecipes] = useState([]);
  const [status, setStatus] = useState("");
  const [percent, setPercent] = useState(0);
  const [current, setCurrent] = useState(1);
  const [level, setLevel] = useState("Mức độ");
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const token = useSelector((state) => state.auth.userInfo.token);
  const handleSaveMenu = () => {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Menu`,
      data: {
        menuName: `Menu ngày ${getCurrentDate()}`,
        recipeIds: listRecipes.map((a) => a.recipeId),
        name: listRecipes.map((a) => a.name), //TODO: Get array of id in menu
      },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setListRecipes([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    console.log("menu",menu);
    
  }, [menu])

  const addRecipe = (recipe) => {
    setListRecipes([...listRecipes, recipe]);
  };

  const removeRecipe = (recipeId) => {
    setListRecipes(listRecipes.filter((item) => item.recipeId !== recipeId));
  };

  const onPageChage = (page) => {
    setCurrent(page);
    setCurrentPage(page -1);
  };

  useEffect(() => {
    let totalKcal = listRecipes.reduce((sum, a) => sum + a.calories, 0);
    let per = (totalKcal / kcal) * 100;
    if (per > 100) {
      setStatus("exception");
    } else {
      setStatus("active");
    }
    setPercent(per.toFixed(2));
  }, [listRecipes]);

  const onSelectLevel = (value) => {
    setLevel(value);
  };

  const onChangeMinTime = (e) => {
    setMinTime(e.target.value);
  };

  const onChangeMaxTime = (e) => {
    setMaxTime(e.target.value);
  };

  const onFilterClick = () => {
    onFilter(level, minTime, maxTime);
  };
  return (
    <div className="recommender-body">
      <div className="recommender-container">
        <div className="menu-mix">
          <div className="menu-detail">
            <h1 className="menu-title">Thực đơn cho bạn</h1>
            {kcal > 0 && <p>Lượng calo mỗi ngày của bạn là {kcal}</p>}
            {listRecipes.map((dish, index) => {
              const { recipeId, name, calories } = dish;
              return (
                <p className="dish" key={index}>
                  <Row>
                    <Col span={18}>{name}</Col>
                    <Col span={4}>{calories}</Col>
                    <Col span={2}>
                      <AiFillDelete
                        className="remove-recipe"
                        onClick={() => removeRecipe(recipeId)}
                      />
                    </Col>
                  </Row>
                </p>
              );
            })}
            <Progress percent={percent} status={status} />
          </div>
          <div className="menu-info">
            <h1>MENU MIX</h1>
            <h3>
              Menu ngày {getCurrentDate()} do{" "}
              <Link to="/" style={{ color: "brown", fontWeight: "bold" }}>
                WhatsEat
              </Link>{" "}
              chọn riêng cho bạn.
            </h3>
          </div>
        </div>
      <Button className="save-btn" onClick={handleSaveMenu}>
          <BiSave className="save-icon" /> Thêm vào Menu của tôi        
        </Button>
        <div className="menu-items">
          <div>
            <div>
              <Row style={{ marginTop: 10 }}>
                <Col>
                  <Input.Group>
                    <span>Mức độ: </span>
                    <Select
                      style={{ width: 110 }}
                      defaultValue={level}
                      onChange={onSelectLevel}
                    >
                      <Option value="Dễ">Dễ</Option>
                      <Option value="Trung bình">Trung bình</Option>
                      <Option value="Khó">Khó</Option>
                    </Select>
                  </Input.Group>
                </Col>
                <Col>
                  <Row>
                    <Input.Group compact>
                      <span className="time-cooking">Thời gian nấu: </span>
                      <Input
                        style={{
                          width: 100,
                          textAlign: "center",
                        }}
                        onChange={onChangeMinTime}
                        placeholder="Tối thiểu"
                      />
                      <Input
                        className="site-input-split"
                        style={{
                          width: 30,
                          borderLeft: 0,
                          borderRight: 0,
                          pointerEvents: "none",
                        }}
                        placeholder="~"
                        disabled
                      />
                      <Input
                        className="site-input-right"
                        style={{
                          width: 100,
                          textAlign: "center",
                        }}
                        onChange={onChangeMaxTime}
                        placeholder="Tối đa"
                      />
                    </Input.Group>
                  </Row>
                </Col>
                <Button onClick={onFilterClick}>Lọc</Button>
              </Row>
            </div>
          </div>
          <h2>Món ăn cho bạn</h2>
          <Tabs defaultActiveKey="2" onChange={onPageChage}>
            <TabPane tab="Món khai vị" key="2"></TabPane>
            <TabPane tab="Món tráng miệng" key="3"></TabPane>
            <TabPane tab="Món chay" key="4"></TabPane>
            <TabPane tab="Món chính" key="5"></TabPane>
            <TabPane tab="Món ăn sáng" key="6"></TabPane>
            <TabPane tab="Món nhanh và dễ" key="7"></TabPane>
            <TabPane tab="Thức uống" key="8"></TabPane>
            <TabPane tab="Bánh-Bánh ngọt" key="9"></TabPane>
            <TabPane tab="Món ăn cho trẻ" key="10"></TabPane>
            <TabPane tab="Món nhậu" key="11"></TabPane>
            </Tabs>
          <DishBox menu={menu} addRecipe={addRecipe} />
        </div>
        {/* <div className="expand-container">
          <h2 className="title">Thêm món</h2>
          <p>Thêm món vào menu của bạn</p>
          {categories.map((category) => {
            return (
              <div className="category" key={category.id}>
                <h3 className="category-name">{category.category_name}</h3>
                <AiOutlinePlusCircle className="icon" />
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

export default Recommender;
