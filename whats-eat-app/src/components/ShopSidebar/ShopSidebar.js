import React from "react";
import "./ShopSidebar.css";
import Collapsible from "react-collapsible";
import { useNavigate } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";

const ShopSidebar = ({ storeId }) => {
  const navigate = useNavigate();
  return (
    <div className="collapse-side-bar">
      <Collapsible
        open={true}
        trigger={["Quản Lý Shop", <BsChevronDown />]}
        triggerStyle={{ fontWeight: "900", fontSize: "1rem" }}
      >
        <div>
          <a
            onClick={() => {
              navigate("/shop/owner", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            Danh sách cửa hàng của user
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              navigate("/shop/profile", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            Hồ sơ chi tiết về cửa hàng
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              navigate("/shop/categories", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            Danh mục của Shop
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              navigate("/shop", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            Thống kê
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              navigate("/shop/rating", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            Đánh giá sản phẩm
          </a>
        </div>
      </Collapsible>
      <Collapsible
        open={true}
        trigger={["Quản Lý Đơn Hàng", <BsChevronDown />]}
        triggerStyle={{ fontWeight: "900", fontSize: "1rem" }}
      >
        <div>
          <a
            onClick={() => {
              navigate("/shop/orders", {
                state: {
                  storeId: storeId,
                  defaultKey: "1",
                },
              });
            }}
          >
            Tất cả đơn
          </a>
        </div>
        
      </Collapsible>
      <Collapsible
        open={true}
        trigger={["Quản Lý Sản Phẩm", <BsChevronDown />]}
        triggerStyle={{ fontWeight: "900", fontSize: "1rem" }}
      >
        <div>
          <a
            onClick={() => {
              navigate("/shop/items", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            tất cả sản phẩm
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              navigate("/shop/additem", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            thêm sản phẩm
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              navigate("/shop/infringingitems", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            sản phẩm vi phạm
          </a>
        </div>
      </Collapsible>
      <Collapsible
        open={true}
        trigger={["Thiết Lập Shop", <BsChevronDown />]}
        triggerStyle={{ fontWeight: "900", fontSize: "1rem" }}
      >
        <div>
          <a
            onClick={() => {
              navigate("/shop/register", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            Đăng kí Shop mới
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              navigate("/shop/address", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            Địa chỉ
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              navigate("/shop/account", {
                state: {
                  storeId: storeId,
                },
              });
            }}
          >
            Tài khoản
          </a>
        </div>
      </Collapsible>
    </div>
  );
};

export default ShopSidebar;
