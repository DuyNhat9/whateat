import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Categories.css";
import "antd/dist/antd.css";
import { Row, Col } from "antd";

const list_categories = [
  {
    id: 1,
    img_url:
      "https://image.cooky.vn/ads/s320/af64129a-a191-4c6b-8887-43e72d995a86.png",
    title: "Thịt Heo",
  },
  {
    id: 2,
    img_url:
      "https://image.cooky.vn/ads/s320/c3dff14a-7c15-40f1-a0cc-ce67055716eb.png",
    title: "Thịt Bò",
  },
  {
    id: 3,
    img_url:
      "https://image.cooky.vn/ads/s320/7599afc0-bbe8-4547-a53f-c00133bfa1a5.png",
    title: "Gà & Vịt",
  },
  {
    id: 4,
    img_url:
      "https://image.cooky.vn/ads/s320/39d51e75-05cd-4c5b-a3a0-082bdae74b63.png",
    title: "Rau Củ",
  },
  {
    id: 5,
    img_url:
      "https://image.cooky.vn/ads/s320/e7728abb-2f5c-4e3e-8a7e-ee8d9bfab13a.png",
    title: "Hải Sản",
  },
  {
    id: 6,
    img_url:
      "https://image.cooky.vn/ads/s320/5f225ed6-a1c3-4ef6-a246-3a6cd2a33397.png",
    title: "Lương Thực",
  },
  {
    id: 7,
    img_url:
      "https://image.cooky.vn/ads/s320/26d4fb05-a828-4292-a8b4-4e7a10e3722d.png",
    title: "Sữa",
  },
  {
    id: 8,
    img_url:
      "https://image.cooky.vn/ads/s320/ac8d4890-4838-429f-8b9e-a8532a1df6cb.png",
    title: "Đồ Uống",
  },
  {
    id: 9,
    img_url:
      "https://image.cooky.vn/ads/s320/1459e7e9-0d7f-4812-a74b-edebc92d9950.jpeg",
    title: "Gia Vị",
  },
  {
    id: 10,
    img_url:
      "https://image.cooky.vn/ads/s320/c00e9614-9082-42ed-b0f5-2646b7220270.png",
    title: "Trứng",
  },
  {
    id: 11,
    img_url:
      "https://image.cooky.vn/ads/s320/6a589a59-7b7c-4a03-b056-4065e227c6b5.png",
    title: "Lẩu",
  },
  {
    id: 12,
    img_url:
      "https://image.cooky.vn/ads/s320/c6a8d728-a9de-41cf-a93f-4b33ca653442.png",
    title: "Hóa Phẩm",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Product/categories`,
    })
      .then((res) => {
        const result = res.data;
        setCategories(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCategories();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="categories">
      <div className="categories-container">
        <Row justify="space-evenly">
          {categories?.map((category) => {
            // const { id, img_url, title } = category;
            return (
              <Col
                span={3}
                key={category.productCategoryId}
                className="category-col"
                onClick={() =>
                  navigate(`/category/${category.productCategoryId}`, {
                    state: {
                      categoryId: category.productCategoryId,
                      categoryName: category.name,
                    },
                  })
                }
              >
                <img
                  src={category.images}
                  alt={category.name}
                  className="category-img"
                />
                <h3 className="category-title">{category.name}</h3>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default Categories;
