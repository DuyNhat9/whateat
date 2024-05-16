import { Dropdown, Input, Tabs } from "antd";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Ratingcard from "../../components/RatingCard/RatingCard";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import "./ShopRating.css";
import { useRef } from "react";
import Categories from "../../components/Categories/Categories";

const { TabPane } = Tabs;
const { Search } = Input;

const mock_rating = [
  {
    order_ID: 1,
    username: "aot2510",
    item_name: "Gà Ta Bình Định Thả Vườn",
    item_img:
      "https://image.cooky.vn/posproduct/g0/6997/s/8f099d38-a334-4315-8be3-5c4a3ead7ee2.jpeg",
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
    item_name: "Thăn Lưng Bò Canada (Ribeye) Cắt Hotpot",
    item_img:
      "https://image.cooky.vn/posproduct/g0/15513/s400x400/66572bb6-d1ea-4221-a523-d33289117088.jpeg",
    stars: 5,
    rate_content:
      "Sản phẩm chất lượng tuyệt vời, lần sau mình sẽ ủng hộ shop tiếp ạ",
    rate_time: "25/10/2021",
    is_reply: true,
    reply:
      "Cảm ơn bạn đã ủng hộ shop ạ, chúc bạn nhiều sức khỏe và mua đồ của shop nhiều hơn nhaaa!",
  },
];

const ShopRating = () => {
  const [reviews, setReviews] = useState([]);
  const [tempReview, setTempReview ] = useState([]);
  const location = useLocation();
  const storeId = location.state.storeId;

  const ratingArr = [];
  reviews.map((review) => ratingArr.push(review.rating));
  const average = ratingArr.reduce((a, b) => a + b, 0) / ratingArr.length;

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/product-reviews?PageNumber=1&PageSize=9000`,
    })
      .then((res) => {
        console.log(res.data);
        setReviews(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tempReview]);

  const ratingRef= useRef("");
  const foodRef= useRef("");
  const categoryRef= useRef("");
  function removeVietnameseTones(str) { 
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    return str;
}
  function handleSearch(){

    const foodValue = foodRef.current.value
    let categoryValue = categoryRef.current.value
    let ratingValue = ratingRef.current.value
    let reviews_after_filter = reviews
    if (ratingValue != "") { // check rating value to filter
        reviews_after_filter = reviews.filter((x)=>x.rating==ratingValue)
    }

    let foods_after_filter = reviews_after_filter

    if (foodValue != "") { // check food name to filter after filtered rating

        foods_after_filter = reviews_after_filter.filter((x)=>removeVietnameseTones(x.product.name.toLowerCase()).includes(removeVietnameseTones(foodValue.toLowerCase())))
        // kiem tra ki tu viet nam va viet hoa de chuyen het sang ki tu thuong de so sang trong search
    }

    let category_after_filter = foods_after_filter 

    if (categoryValue != "") { // check category value to filter after filered food and rating
        
        category_after_filter = foods_after_filter.filter((x)=>x.product.productCategory==categoryValue)}

    setTempReview(category_after_filter)

  }

  function resetSearch(){
    const reset_search = foodRef.current.value = ratingRef.current.value = categoryRef.current.value = ""
    // reset thanh search ve cac ref sang ""
    setTempReview(reset_search)

  }
  
  return (
    <div className="shop-rating">
      <div className="shop-rating-fluid">
        <div className="shop-rating-container">
          <ShopSidebar storeId={storeId} />
          <div className="content-container">
            <div className="shop-rating-nav">
              <div>
                <h1 className="title">Đánh Giá Shop</h1>
                <p className="note">Xem đánh giá shop của bạn</p>
                <input ref={foodRef} type="text" placeholder="Mời nhập tên món ăn"></input>
                <select className="tabSelect" ref={categoryRef} >
                    <option value="">Loại món ăn</option>
                    <option value="1">Trái Cây</option>
                    <option value="2">Rau củ</option>
                    <option value="3">Hải sản</option>
                    <option value="4">Thịt heo</option>
                    <option value="5">Gà vịt</option>
                    <option value="6">Bò dê</option>
                    <option value="7">Món canh</option>
                    <option value="8">Combo</option>
                    <option value="9">Trứng</option>
                    <option value="10">Lương thực</option>
                    <option value="11">Món chay</option>
                    <option value="12">Lẩu</option>
                    <option value="13">Sữa</option>
                    <option value="14">Gia vị</option>
                    <option value="15">Đồ uống</option>
                    <option value="16">Bánh kẹo</option>
                </select>
                <select ref={ratingRef} id="rating" name="ratings">
                    <option value="">All rating</option>
                    <option value="0"> 0 star</option>
                    <option value="1"> 1 star</option>
                    <option value="2"> 2 stars</option>
                    <option value="3"> 3 stars</option>
                    <option value="4"> 4 stars</option>
                    <option value="5"> 5 stars</option>
                </select>

                <i class="fa fa-refresh" onClick={resetSearch} ></i> {/*icon de reset*/}
                <br></br>
                <button onClick={handleSearch}>Search</button>
                <button onClick={Categories}>"Test(no funtion)"</button>
              </div>
              <p className="evarage-rating">

                <span>{ratingRef.current.value != "" ? (reviews.filter((x)=>x.rating==ratingRef.current.value).reduce((total, next) => total + next.rating, 0)
                / reviews.filter((x)=>x.rating==ratingRef.current.value).length) 
                : (reviews.reduce((total, next) => total + next.rating, 0)
                / reviews.length) } </span> / 5
                {/*tinh trung binh rating */}
              </p>
            </div>
            <br></br>
            {((reviews.length > 0) ?
(
  (ratingRef.current.value == "" && foodRef.current.value == "" && categoryRef.current.value == "" ? //xet dieu kien value cua cac ref de xuat ratingcard dung voi filter
  (
    <div className="rating-container">
        <div className="table-title">
          <p>Thông tin sản phẩm</p>
          <p>Đánh giá của người mua</p>
          <p>Trả lời đánh giá của bạn</p>
        </div>
        {reviews?.map((review, idx) => {
          return <Ratingcard key={idx} {...review} />;
        })}
  </div>)
  :(
    (tempReview.length > 0) ?

    (
     <div className="rating-container">
         <div className="table-title">
           <p>Thông tin sản phẩm</p>
           <p>Đánh giá của người mua</p>
           <p>Trả lời đánh giá của bạn</p>
         </div>
         {tempReview?.map((review, idx) => {//tempReview la review da duoc filter truoc o tren
           return <Ratingcard key={idx} {...review} />;
         })}
   </div>)
    : (
     <p>Đánh giá không tồn tại</p>
   )
  ))
)
:
(<p>Cửa hàng của bạn chưa có đánh giá nào</p>)
)}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopRating;
