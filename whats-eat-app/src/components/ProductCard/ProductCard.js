import React from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai";

const ProductCard = ({
  productId,
  name,
  images,
  weightServing,
  provider,
  totalSell,
  basePrice,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() =>
        navigate(`/singleproduct/${productId}`, {
          state: {
            productId: productId,
          },
        })
      }
    >
      <img src={images[0][1].url} alt={name} />
      <div className="info">
        <p className="product-name">{name}</p>
        <p className="quantity">
          {weightServing} | {provider || "WhatseatFARM"}
        </p>
        <p className="sales-count">{totalSell} mua</p>
        <p className="price">
          {basePrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      </div>
      <AiFillPlusCircle className="icon-plus" />
    </div>
  );
};

export default ProductCard;
