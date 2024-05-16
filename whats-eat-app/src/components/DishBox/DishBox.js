import React, { useEffect, useState } from "react";
import "./DishBox.css";
import DishRecommended from "../Dish/DishRecommended";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { Row, Col,Tabs } from "antd";
const DishBox = ({ menu, category, addRecipe }) => {
  const [isShowRecipe, setIsShowRecipe] = useState(true);
  const handleShow = () => setIsShowRecipe(true);
  const handleHidden = () => setIsShowRecipe(false);
  return (
    <div>

      <div className="list-dish">
        <Row gutter={[16, 24]}>
          {menu.map((dish) => {
            const {
              recipeId,
              name,
              images,
              totalLike,
              totalTime,
              totalView,
              calories,
            } = dish;
            return (
              <Col className="gutter-row" span={4}>
                <DishRecommended
                  {...dish}
                  className="single-dish"
                  isShowRecipe={isShowRecipe}
                  addRecipe={addRecipe}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default DishBox;


