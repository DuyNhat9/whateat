import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Items from "../../components/Items/Items";
import Footer from "../../components/Footer/Footer";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import AppContext from "../../context/AppContext";
import "./ShopItems.css";

const ShopItems = () => {
  const [listProducts, setListProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const location = useLocation();
  const { triggerReload } = useContext(AppContext);
  const storeId = location.state.storeId;

  const getShopProducts = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/${storeId}/products?PageSize=30`,
    })
      .then((res) => {
        const result = res.data;
        console.log(result);
        setListProducts(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getShopProducts();
  }, [pageNumber, triggerReload]);
  return (
    <div className="shop-items">
      <div className="shop-items-fluid">
        <div className="shop-items-container">
          <ShopSidebar storeId={storeId} />
          <div className="content-container">
            <h1 className="title">Tất cả sản phẩm</h1>
            <Items products={listProducts} storeId={storeId} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopItems;
