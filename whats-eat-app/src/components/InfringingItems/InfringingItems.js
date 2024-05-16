import React from "react";
import "./InfringingItems.css";
import "antd/dist/antd.css";
import { Row, Col } from "antd";

import Product from "../Product/Product";

const items = [
  {
    id: 1,
    img_url:
      "https://image.cooky.vn/posproduct/g0/15055/s400x400/2838f017-9ab8-45cc-8ae2-0f6382f54347.jpeg",
    item_name: "Nạc vai bò Mỹ",
    weight: "2",
    price: 72000,
  },
  {
    id: 2,
    img_url:
      "https://image.cooky.vn/posproduct/g0/8128/s400x400/8739bbae-e1d5-4bac-bbb1-6410c205560d.jpeg",
    item_name: "Thăn lưng bò Canada",
    weight: "2",
    price: 74000,
  },
  {
    id: 3,
    img_url:
      "https://image.cooky.vn/posproduct/g0/7035/s400x400/d3690499-e842-4518-b7eb-05c0e195d55f.jpeg",
   item_name : "Chân gà",
    weight: "3",
    price: 15000,
  },
];

const InfringingItems = () => {
  return (
    <div className="items-container">
      <div className="items">
        <Row gutter={[16, 16]}>
          {items.map((item) => {
            const { id, img_url, item_name, weight, price } = item;
            return (
              <Col span={6} className="item-col" key={id}>
                <h2>Lỗi: Thông tin sản phẩm chưa rõ ràng</h2>
                <Product {...item} />
                <button className="btn">Xóa</button>
                <button className="btn">Sửa</button>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default InfringingItems;
