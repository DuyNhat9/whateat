import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Categories from "../../components/Categories/Categories";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./CategoryPage.css";

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const categoryId = location.state.categoryId;
  const categoryName = location.state.categoryName;
  console.log("Category id:", categoryId);
  console.log("Category name:", categoryName);
  // fetch products by category
  
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Product/categories/${categoryId}`,
    })
      .then((res) => {
        const result = res.data;
        console.log("products by category:", result);

        setProducts(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [categoryId]);

  return (
    <div className="category">
      <div className="category-fluid">
        <div className="category-container">
          <h1 style={{ fontWeight: "900", fontSize: "1.5rem" }}>
            Danh mục sản phẩm
          </h1>
          <Categories />
          <div className="content">
            <h3 className="title">
              {categoryName} <span>{`(${products.length} sản phẩm)`}</span>
            </h3>
            <div className="product-list">
              {products.map((product, idx) => {
                return <ProductCard key={idx} {...product} />;
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;

const mock_type = [
  {
    id: 1,
    type_name: "Ba rọi",
  },
  {
    id: 2,
    type_name: "Sườn",
  },
  {
    id: 3,
    type_name: "Đùi heo",
  },
  {
    id: 4,
    type_name: "Thăn heo",
  },
  {
    id: 6,
    type_name: "Giò & đuôi heo",
  },
];
