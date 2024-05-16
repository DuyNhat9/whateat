import React from "react";
import Footer from "../../components/Footer/Footer";
import InfringingItems from "../../components/InfringingItems/InfringingItems";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import "./ShopInfringingItems.css";

const ShopInfringingItems = () => {
  return (
    <div className="shop-infringing-items">
      <div className="shop-infringing-items-fluid">
        <div className="shop-infringing-items-container">
          <ShopSidebar />
          <div className="content-container">
            <h1 className="title">Sản phẩm vi phạm</h1>
            <InfringingItems />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopInfringingItems;
