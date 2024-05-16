import React, { useState, useEffect } from "react";
import "./TopDishes.css";
import "antd/dist/antd.css";
import axios from "axios";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import Dish from "../Dish/Dish";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";

const TopDishes = () => {
  const [topRecipe, setTopRecipe] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/search?sortAvgRating=desc&PageNumber=${pageNumber}&PageSize=${pageSize}`,
    })
      .then((res) => {
        setTopRecipe(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber]);
  const navigate = useNavigate();

  if (!topRecipe) {
    return <h1 className="loading...">Loading</h1>;
  }

  return (
    <div className="top-dishes-container">
      {topRecipe.length > 0 && (
        <div className="top-dishes">
          <h1 className="title">Top món ăn thịnh hành</h1>
          <FaChevronCircleLeft
            className={`${
              pageNumber === 1 ? "hidden " : ""
            }icon-pagination left-icon`}
            onClick={() => setPageNumber(pageNumber - 1)}
          />
          <FaChevronCircleRight
            className={`${
              pageNumber === 10 ? "hidden " : ""
            }icon-pagination right-icon`}
            onClick={() => setPageNumber(pageNumber + 1)}
          />
          <Row gutter={[16, 16]}>
            {topRecipe.map((dish) => {
              return (
                <Col
                  span={6}
                  key={dish.recipeId}
                  className="dish-col"
                  onClick={() =>
                    navigate(`/singledish/${dish.recipeId}`, {
                      state: {
                        recipeId: dish.recipeId,
                      },
                    })
                  }
                >
                  <Dish {...dish} />
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
};

export default TopDishes;
