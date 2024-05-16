import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsCartCheck, BsCartPlus, BsHeart } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

import { addItemToCart } from "../../reducers/cart";
import RecommendedItems from "../../components/TopItems/RecommendedItems";
import Footer from "../../components/Footer/Footer";
import Counter from "../../components/Counter/Counter";
import TopDishes from "../../components/TopDishes/TopDishes";
import TopItems from "../../components/TopItems/TopItems";
import "./SingleProductPage.css";
import ProductsByShop from "../../components/TopItems/ProductsByShop";
import ProductReview from "../../components/ProductReview/ProductReview";

const SingleProductPage = () => {
  const [productDetail, setProductDetail] = useState({});
  const [count, setCount] = useState(1);
  const [productIds, setProductIds] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const productId = location.state.productId;
  const getProductDetail = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Product/${productId}`, //TODO: Changle hard code into idProduct
    })
      .then((res) => {
        const result = res.data;
        setProductDetail(result);
        setProductIds([...productIds, productId]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleDecrease = () => {
    if (count === 1) {
      setCount(1);
    } else setCount(count - 1);
  };

  const buyNow = () => {
    if (auth.userName) {
      dispatch(addItemToCart({ productId, productDetail, count }));
      navigate(`/cart`);
    } else {
      navigate(`/login`);
    }
  };

  const addToCart = () => {
    if (auth.userName) {
      dispatch(addItemToCart({ productId, productDetail, count }));
      let secondsToGo = 3;
      const modal = Modal.success({
        title: "Sản phẩm đã được thêm vào giỏ hàng",
        okButtonProps: {
          disabled: true,
          className: "modal-footer-hiden-button",
        },
      });
      const timer = setInterval(() => {
        secondsToGo -= 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        modal.destroy();
      }, secondsToGo * 1000);
    } else {
      navigate(`/login`);
    }
  };
  useEffect(() => {
    getProductDetail();
  }, [productId]);

  if (!productDetail.images) {
    return (
      <div
        style={{
          height: "85vh",
          display: "flex",
          alignItem: "center",
          justifyContent: "center",
          fontSize: "3rem",
          fontWeight: "900",
          marginTop: "15rem",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="single-product">
      <div className="single-product-fluid">
        <div className="single-product-container">
          <h1 className="title">Chi tiết sản phẩm</h1>
          <div className="product-block">
            <div className="img-container">
              <img
                src={productDetail.images[0][1].url}
                alt={productDetail.name}
                className="main-img"
              />
            </div>
            <div className="product-info">
              <h1 className="product-name">{productDetail.name}</h1>
              <div className="detail">
                <h3 className="product-type">Đồ Tươi</h3>
                <div className="sales-info">
                  <BsCartCheck className="cart-icon" />
                  <span>{productDetail.totalSell}</span>
                </div>
              </div>
              <h1 className="price">
                {productDetail.basePrice?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }) || 40000}
              </h1>
              <div className="instock">
                <Counter
                  count={count}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
                <p className="item-left">
                  {productDetail.inStock} sản phẩm có sẵn
                </p>
              </div>
              <div className="btn-block">
                <button className="btn save-btn">
                  <BsHeart className="icon" />
                  <span>Lưu</span>
                </button>
                <button className="btn cart-btn" onClick={addToCart}>
                  <BsCartPlus className="icon" />
                  <span>Thêm vào giỏ</span>
                </button>
                <button onClick={buyNow} className="btn buy-btn">
                  Mua ngay
                </button>
              </div>
              <div className="brand-info-block">
                <div>
                  <p>Định lượng</p>
                  <p className="content weight">
                    {productDetail.weightServing}
                  </p>
                </div>
                <div>
                  <p>Thương hiệu</p>
                  <p className="content brand">
                    {productDetail.storeName || "DONA FARM"}
                  </p>
                </div>
                <div>
                  <p>Xuất xứ</p>
                  <p className="content origin">Đồng Nai</p>
                </div>
              </div>
              <div className="description-block">
                <h2>Mô tả sản phẩm</h2>
                <p>
                  {productDetail.description || "Sản phẩm đảm bảo chất lượng"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <ProductReview productId={productId} />
          </div>
        </div>
      </div>
      <RecommendedItems productIds={productIds} />
      <ProductsByShop storeId={productDetail.storeId} />
      <TopItems />
      <TopDishes />
      <Footer />
    </div>
  );
};

export default SingleProductPage;

const product = {
  id: 1,
  product_name: "Ba rọi heo (thịt tươi)",
  product_type: "đồ tươi",
  img_url:
    "https://image.cooky.vn/posproduct/g0/9593/s400x400/37b78803-7264-42da-a39c-c48d3796d803.jpeg",
  sale_count: 50,
  price: 42000,
  weight: "300g",
  brand: "dona farm",
  origin: "đồng nai",
  description:
    "Thịt ba rọi (ba chỉ) có lớp thịt và lớp mỡ xen kẽ đẹp mắt, chất thịt tươi mới, giàu dinh dưỡng. Bởi có hương vị thịt béo hài hòa đặc trưng nên ba rọi rất được ưa chuộng để chế biến nhiều món ngon hấp dẫn như luộc, chiên, nướng... đều tuyệt vời.",
};

const mock_rating = [
  {
    order_ID: 1,
    username: "lyquynhtram",
    item_name: "Ba rọi heo (thịt tươi)",
    item_img:
      "https://image.cooky.vn/posproduct/g0/9593/s400x400/37b78803-7264-42da-a39c-c48d3796d803.jpeg",
    stars: 4,
    rate_content: "Sản phẩm chất lượng tuyệt vời",
    rate_time: "25/10/2021",
    is_reply: true,
    reply:
      "Cảm ơn bạn đã ủng hộ shop ạ, chúc bạn nhiều sức khỏe và mua đồ của shop nhiều hơn nhaaa!",
  },
  {
    order_ID: 2,
    username: "hiepsimattroi",
    item_name: "Ba rọi heo (thịt tươi)",
    item_img:
      "https://image.cooky.vn/posproduct/g0/9593/s400x400/37b78803-7264-42da-a39c-c48d3796d803.jpeg",
    stars: 5,
    rate_content:
      "Sản phẩm chất lượng tuyệt vời, lần sau mình sẽ ủng hộ shop tiếp ạ",
    rate_time: "25/10/2021",
    is_reply: true,
    reply:
      "Cảm ơn bạn đã ủng hộ shop ạ, chúc bạn nhiều sức khỏe và mua đồ của shop nhiều hơn nhaaa!",
  },
  {
    order_ID: 3,
    username: "tranthivi",
    item_name: "Ba rọi heo (thịt tươi)",
    item_img:
      "https://image.cooky.vn/posproduct/g0/9593/s400x400/37b78803-7264-42da-a39c-c48d3796d803.jpeg",
    stars: 1,
    rate_content: "Sản phẩm quá tệ, không bao giờ mua lại",
    rate_time: "25/10/2021",
    is_reply: false,
    reply:
      "Bạn ơi có nhầm lẫn gì không ạ? Thịt bên mình đảm bảo tươi và ngon ạ :(",
  },
  {
    order_ID: 4,
    username: "dinhthiminhhieu",
    item_name: "Ba rọi heo (thịt tươi)",
    item_img:
      "https://image.cooky.vn/posproduct/g0/9593/s400x400/37b78803-7264-42da-a39c-c48d3796d803.jpeg",
    stars: 4,
    rate_content: "Sản phẩm cũng được, luộc chấm mắm nêm bá cháy",
    rate_time: "25/10/2021",
    is_reply: true,
    reply:
      "Cảm ơn bạn đã ủng hộ shop ạ, chúc bạn nhiều sức khỏe và mua đồ của shop nhiều hơn nhaaa!",
  },
  {
    order_ID: 5,
    username: "phamhoangan",
    item_name: "Ba rọi heo (thịt tươi)",
    item_img:
      "https://image.cooky.vn/posproduct/g0/9593/s400x400/37b78803-7264-42da-a39c-c48d3796d803.jpeg",
    stars: 5,
    rate_content:
      "Sản phẩm chất lượng tuyệt vời, mình kho ny mình khen nức nở hehe",
    rate_time: "25/10/2021",
    is_reply: true,
    reply: "Cảm ơn bạn đã ủng hộ shop ạ, chúc bạn và người yêu mãi mận nhaaa!",
  },
  {
    order_ID: 6,
    username: "nguyenvanhao",
    item_name: "Ba rọi heo (thịt tươi)",
    item_img:
      "https://image.cooky.vn/posproduct/g0/9593/s400x400/37b78803-7264-42da-a39c-c48d3796d803.jpeg",
    stars: 1,
    rate_content: "Sản phẩm ngon nhưng cờ Việt Nam có 1 sao nên :)))",
    rate_time: "25/10/2021",
    is_reply: false,
    reply: "Bạn ơi bạn đừng làm thế tội shop ạ :(",
  },
];
