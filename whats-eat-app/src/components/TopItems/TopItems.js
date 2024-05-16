import React, { useState, useEffect } from "react";
import "./TopItems.css";
import axios from "axios";
import "antd/dist/antd.css";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import Product from "../Product/Product";

const TopItems = () => {
  const [topProduct, setTopProduct] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    axios({
      method: "get",
      url: `${
        process.env.REACT_APP_ASP_API_KEY
      }/api/Product?sortTotalSell=desc&PageNumber=${pageNumber}&PageSize=${
        pageSize + 4
      }`,
    })
      .then((res) => {
        setTopProduct(res.data);
        if (!res.data) {
          setPageNumber(pageNumber - 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber]);
  const navigate = useNavigate();

  if (!topProduct) {
    return <h1 className="loading">Loading...</h1>;
  }

  return (
    <div className="top-items-container">
      {topProduct.length > 0 && (
        <div className="top-items">
          <h1 className="title">Trending trong tuần qua</h1>
          <FaChevronCircleLeft
            className={`${
              pageNumber === 1 ? "hidden " : ""
            }icon-pagination left-icon`}
            onClick={() => setPageNumber(pageNumber - 1)}
          />
          <FaChevronCircleRight
            className={`${
              pageNumber === 10 || topProduct.length < 12 ? "hidden " : ""
            }icon-pagination right-icon`}
            onClick={() => setPageNumber(pageNumber + 1)}
          />
          
          <Row gutter={[16, 16]}>
            {topProduct.map((item) => {
              const {
                productId,
                name,
                totalSell,
                basePrice,
                weightServing,
                images,
                status,
              } = item;
              if (!status) return <></>;
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

export default TopItems;
