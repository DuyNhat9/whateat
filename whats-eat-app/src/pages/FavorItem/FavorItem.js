import { Col, Row } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import Footer from "../../components/Footer/Footer";
import Product from "../../components/Product/Product";
import "./FavorItem.css";

const FavorItem = () => {
  return (
    <div className="fav-item">
      <div className="fav-item-nav">
        <h1 className="title">Thực phẩm yêu thích</h1>
      </div>
      <div className="fav-item-fluid">
        <div className="fav-item-container">
          <Row gutter={[16, 16]}>
            {items.map((item) => {
              const { id, img_url, item_name, weight, price } = item;
              return (
                <Col span={6} className="item-col" key={id}>
                  <div class="fav-item-card">
                    <Product {...item} />
                    <div className="heart-icon">
                      <AiFillHeart className="icon" style={{ color: "red" }} />
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavorItem;

const items = [
  {
    id: 1,
    img_url:
      "https://image.cooky.vn/posproduct/g0/17007/s400x400/e94fbb1b-f16c-4b36-9a55-a1e66e8e62a7.jpeg",
    item_name: "Gà Tam Hoàng(1/2 Con)",
    weight: "1/2 Con",
    price: 62000,
  },
  {
    id: 2,
    img_url:
      "https://image.cooky.vn/posproduct/g0/17009/s400x400/8075338b-0fea-49d7-9e05-7ef1dd0aabd4.jpeg",
    item_name: "Gà Tam Hoàng(Nguyên Con)",
    weight: "1 Con",
    price: 134000,
  },
  {
    id: 3,
    img_url:
      "https://image.cooky.vn/posproduct/g0/8671/s400x400/5cb6f4a6-cda6-4acc-a8c9-65bfcb01add8.jpeg",
    item_name: "Tôm Sú Quảng Canh",
    weight: "400-420g",
    price: 140000,
  },
  {
    id: 4,
    img_url:
      "https://image.cooky.vn/posproduct/g0/13852/s400x400/c6f09391-a974-4d05-9c47-d3096aded7c4.jpeg",
    item_name: "Bắp Giò Heo",
    weight: "300-350g",
    price: 22800,
  },
  {
    id: 5,
    img_url:
      "https://image.cooky.vn/posproduct/g0/9752/s400x400/ab6197c5-1f3e-4fef-980c-a7de0ec2d21b.jpeg",
    item_name: "Bún Tươi Mikiri sợi nhỏ",
    weight: "400g",
    price: 29400,
  },
  {
    id: 6,
    img_url:
      "https://image.cooky.vn/posproduct/g0/12447/s400x400/177e2cd7-1885-4e3d-a617-0a410a7884cd.jpeg",
    item_name: "Xương Ống Heo",
    weight: "500-550g",
    price: 33000,
  },
  {
    id: 7,
    img_url:
      "https://image.cooky.vn/posproduct/g0/16316/s400x400/524eeac4-97e3-4b39-834b-940f4567d136.jpeg",
    item_name: "Cá Chẽm Phi lê",
    weight: "250-300g",
    price: 65000,
  },
  {
    id: 8,
    img_url:
      "https://image.cooky.vn/posproduct/g0/13832/s400x400/24530a15-d966-4db0-a693-94058998876f.jpeg",
    item_name: "Cá Lóc Đồng Làm Sạch",
    weight: "200-220g",
    price: 22000,
  },
];
