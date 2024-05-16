import { Button } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BsShop } from "react-icons/bs";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import CartItem from "../CartItem/CartItem";
import RecommendedItems from "../TopItems/RecommendedItems";
import "./Cart.css";

const Cart = ({
  cartItems,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  clearCart,
}) => {
  const productIds = cartItems.map((item) => item.productId);
  const listShop = [];
  cartItems.map((item) =>
    listShop.push({
      storeId: item.storeId,
      storeName: item.storeName,
    })
  );
  const noDuplicateListShop = [
    ...new Map(listShop.map((obj) => [JSON.stringify(obj), obj])).values(),
  ];
  const navigate = useNavigate();

  return (
    <div className="cart">
      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <img
            className="empty-cart-img"
            src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/9bdd8040b334d31946f49e36beaf32db.png"
          />
          <p className="empty-cart-noti">Giỏ hàng của bạn còn trống</p>
          <Button className="buy-btn" href="/recommender" type="primary">
            MUA NGAY
          </Button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-fluid">
            <div className="cart-nav">
              <h1 className="title">Giỏ hàng của bạn</h1>
              <h1 className="empty-cart" onClick={clearCart}>
                Xóa hết
              </h1>
            </div>
            <div className="items-container">
              {noDuplicateListShop.map((shop, idx) => {
                return (
                  <div key={idx}>
                    <h2
                      className="shop-name"
                      onClick={() =>
                        navigate(`/viewshop/${shop.storeId}`, {
                          state: {
                            storeId: shop.storeId,
                          },
                        })
                      }
                    >
                      <BsShop style={{ marginRight: "0.5rem" }} />
                      {shop.shopName || "WhatseatFARM"}
                    </h2>
                    {cartItems.map((item, index) => {
                      if (item.storeId === shop.storeId)
                        return (
                          <CartItem
                            key={index}
                            {...item}
                            decreaseQuantity={decreaseQuantity}
                            increaseQuantity={increaseQuantity}
                            onDelete={() => removeItem(item.productId)}
                          />
                        );
                      else return <></>;
                    })}
                  </div>
                );
              })}
              <Link to="/payment" className="pay-btn">
                MUA HÀNG
              </Link>
            </div>
          </div>
        </div>
      )}
      <RecommendedItems productIds={productIds} />
      <Footer />
    </div>
  );
};

export default Cart;
