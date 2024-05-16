import React, { useState } from "react";
import "./CartItem.css";

import Counter from "../../components/Counter/Counter";
import { FaTrashAlt } from "react-icons/fa";
import { Checkbox } from "antd";
import "antd/dist/antd.css";

const CartItem = ({
  productId,
  productName,
  quantity,
  image,
  weightServing,
  price,
  totalPrice,
  onDelete,
  decreaseQuantity,
  increaseQuantity,
}) => {
  const handleIncrease = () => {
    increaseQuantity({ id: productId, price });
  };

  const handleDecrease = () => {
    decreaseQuantity({ id: productId, price });
  };

  return (
    <div className="single-item">
      {/* <Checkbox></Checkbox> */}
      <img className="item-img" src={image} alt={productName} />
      <div className="item-fluid">
        <div className="item-info">
          <h3 className="item-name">{productName}</h3>
          <span>{weightServing}</span>
          <p className="price">
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
        <div className="count-and-delete">
          <Counter
            count={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
          <FaTrashAlt
            className="delete-btn"
            onClick={() => onDelete(productId)}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
