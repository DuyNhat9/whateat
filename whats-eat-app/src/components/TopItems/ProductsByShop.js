import React, { useState, useEffect } from "react";
import "./TopItems.css";
import axios from "axios";
import "antd/dist/antd.css";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";

import Product from "../Product/Product";

const ProductsByShop = ({ storeId }) => {
  const [productByShop, setProductByShop] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  console.log(storeId);

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/${storeId}/products?PageNumber=1&PageSize=12`,
    })
      .then((res) => {
        setProductByShop(res.data);
        if (!res.data) {
          setPageNumber(pageNumber - 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber]);
  const navigate = useNavigate();

  if (!productByShop) {
    return <h1 className="loading">Loading...</h1>;
  }
  return (
    <div className="top-items-container">
      {productByShop.length > 0 && (
        <div className="top-items">
          <h1 className="title">Sản phẩm cùng shop</h1>
          <FaChevronCircleLeft
            className={`${
              pageNumber === 1 ? "hidden " : ""
            }icon-pagination left-icon`}
            onClick={() => setPageNumber(pageNumber - 1)}
          />
          <FaChevronCircleRight
            className={`${
              pageNumber === 10 || productByShop.length < 12 ? "hidden " : ""
            }icon-pagination right-icon`}
            onClick={() => setPageNumber(pageNumber + 1)}
          />
          <Row gutter={[16, 16]}>
            {productByShop.map((item) => {
              const { productId, name, basePrice, weightServing, images } =
                item;
              return (
                <Col span={4} className="item-col" key={productId}>
                  <Product {...item} />
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductsByShop;
