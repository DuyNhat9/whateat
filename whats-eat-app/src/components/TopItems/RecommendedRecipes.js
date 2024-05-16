import React, { useState, useEffect } from "react";
import "./TopItems.css";
import axios from "axios";
import { useSelector } from "react-redux";
import "antd/dist/antd.css";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";

import Dish from "../Dish/Dish";

const RecommendedRecipes = (props) => {
  const [topRecipe, setTopRecipe] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  let params = "";
  props.productIds.forEach((element) => {
    params += `id_recipe=${element}&`;
  });
  const url = params.substring(0, params.length - 1);
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_PYTHON_API_KEY}/individual/recipe/apriori?${url}`,
    })
      .then((res) => {
        setTopRecipe(res.data);
        if (!res.data) {
          setPageNumber(pageNumber - 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber, url]);
  const navigate = useNavigate();

  if (!topRecipe) {
    return <h1 className="loading">Loading...</h1>;
  }
  return (
    <div className="top-items-container">
      {topRecipe.length > 0 && (
        <div className="top-items">
          <h1 className="title">Món ăn dùng cùng</h1>
          <Row gutter={[16, 16]}>
            {topRecipe.map((item) => {
              const { productId, name, basePrice, weightServing, images } =
                item;
              return (
                <Col span={6} className="item-col" key={productId}>
                  <Dish {...item} />
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
};

export default RecommendedRecipes;
