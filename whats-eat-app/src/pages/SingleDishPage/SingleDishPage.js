import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import StarRatings from "react-star-ratings";
import {
  AiFillThunderbolt,
  AiOutlineBarChart,
  AiOutlineClockCircle,
  AiOutlineEye,
  AiFillHeart,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Comment from "../../components/Comment/Comment";
import RecipeReview from "../../components/RecipeReview/RecipeReview";
import Footer from "../../components/Footer/Footer";
import Guide from "../../components/Guide/Guide";
import "./SingleDishPage.css";
import IngredientBox from "../../components/IngredientBox/IngredientBox";
import TopItems from "../../components/TopItems/TopItems";
import RecommendedRecipes from "../../components/TopItems/RecommendedRecipes";
import { Input, Checkbox, Form } from "antd";
import AppContext from "../../context/AppContext";

console.log("reload");

const SingleDishPage = () => {
  const [dishDetail, setDishDetail] = useState([]);
  const [isLikeRecipe, setIsLikeRecipe] = useState(false);
  const [productIds, setProductIds] = useState([]);
  const [totalLove, setTotalLove] = useState(0);
  const [servingNumber, setServingNumber] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);
  const token = useSelector((state) => state.auth.userInfo.token);
  const location = useLocation();
  const { triggerReload } = useContext(AppContext);
  const recipeId = location.state.recipeId;
  const calculatedArray = [];
  const [newIngreadients, setNewIngreadients] = useState([]);
  const [form] = Form.useForm();
  const {
    description,
    avgRating,
    images,
    ingredients,
    steps,
    name,
    serving,
    totalLike,
    totalTime,
    level,
    totalView,
  } = dishDetail;
  const price = 230000;

  const getTotalLove = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/love/total/${recipeId}`,
    })
      .then((res) => {
        //TODO: handle logic set total like
        setTotalLove(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleLikeRecipe = () => {
    setIsLikeRecipe(!isLikeRecipe);
    const isLike = !isLikeRecipe;
    if (isLike) {
      console.log("like recipe");
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/love/${recipeId}`,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          getTotalLove();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("unlike recipe");
      axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/love/${recipeId}`,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          getTotalLove();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCalculateIngredients = () => {
    const list = calculatedArray.map((item) => {
      const ingreQuantity =
        Math.round(((+item.quantity * servingNumber) / serving) * 2) / 2;
      return {
        name: item.name,
        unit: item.unit.unit,
        quantity: ingreQuantity,
      };
    });

    setNewIngreadients(list);
    form.resetFields();
    console.log(servingNumber, calculatedArray, newIngreadients);
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/love/isLoved/${recipeId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setIsLikeRecipe(res.data);
        setProductIds([...productIds, recipeId]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/${recipeId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const result = res.data;

        setDishDetail(result);
        setTotalLove(result.totalLike);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [triggerReload]);
  if (!steps || !images || !ingredients) {
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
    // <AppProvider>
    <div className="single-dish">
      <div className="single-dish-fluid">
        <div className="single-dish-container">
          <h1 className="title">Chi tiết món ăn</h1>
          <div className="dish-block">
            <div style={{ width: "60%" }}>
              <img src={images[0].url} alt={name} className="main-img" />
              <h1 className="dish-name">
                {name} (Cho {serving} người ăn)
              </h1>
              <p
                className="desc"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              <div className="rating-block">
                <div className="stars">
                  <StarRatings
                    rating={avgRating}
                    starRatedColor="brown"
                    numberOfStars={5}
                    name="rating"
                    starDimension="25px"
                    starSpacing="3px"
                  />
                </div>
                <div
                  className={`${
                    isLikeRecipe ? "recipe-liked" : "recipe-not-liked"
                  } love`}
                  onClick={handleLikeRecipe}
                >
                  <AiFillHeart className="icon" /> <span>{totalLove}</span>
                </div>
                <div className="view">
                  <AiOutlineEye className="icon" /> <span>{totalView}</span>
                </div>
              </div>
              <div className="dish-info">
                <div className="info-detail">
                  <div>
                    <AiOutlineClockCircle className="icon" />{" "}
                    <span>{totalTime}</span>
                  </div>
                </div>
                <div className="info-detail">
                  <div>
                    <AiFillThunderbolt className="icon" />{" "}
                    <span>{level || "Dễ"}</span>
                  </div>
                </div>
                <div className="info-detail">
                  <div>
                    <AiOutlineBarChart className="icon" />{" "}
                    <span>{totalView}</span> xem
                  </div>
                </div>
              </div>
            </div>
            <div className="form-calc">
              <Form form={form}>
                <h1 className="form-title">
                  Bạn muốn thay đổi số người ăn? Tính toán lượng nguyên liệu tại
                  đây.
                </h1>
                <p className="label">Nhập số người ăn:</p>
                <Form.Item>
                  <Input
                    type="number"
                    placeholder="Nhập số người..."
                    onChange={(e) => setServingNumber(+e.target.value)}
                  />
                </Form.Item>
                <div className="checkbox-area">
                  <p className="label">Chọn loại nguyên liệu muốn tính:</p>
                  <div>
                    <Form.Item name="listIngredients">
                      {ingredients?.map((item, idx) => {
                        return (
                          <Checkbox
                            key={idx}
                            onChange={(e) => {
                              if (e.target.checked === true) {
                                calculatedArray.push(item);
                              } else calculatedArray.splice(idx, 1);
                            }}
                          >
                            {item.name}
                          </Checkbox>
                        );
                      })}
                    </Form.Item>
                  </div>
                </div>
                <button
                  className="result"
                  onClick={() => handleCalculateIngredients()}
                >
                  Xem kết quả
                </button>
              </Form>
              {newIngreadients.length > 0 && (
                <>
                  <h1 className="form-title">
                    Nguyên liệu để nấu cho {servingNumber} người ăn
                  </h1>
                  {newIngreadients.map((item) => (
                    <p>
                      {item.name}: {item.quantity} {item.unit}
                    </p>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="combo-box">
            <p className="noti">Mua ngay combo thực phẩm chế biến {name}</p>
            <img
              src={images[0].url ? images[0].url : ""}
              alt="combo"
              className="combo-img"
            />
            <p className="combo-name">Combo {name}</p>
            <p className="combo-detail">
              {`${ingredients[0].name}${
                ingredients[1]?.name ? `, ${ingredients[1]?.name}` : ""
              }${ingredients[2]?.name ? `, ${ingredients[2]?.name}` : ""} và ${
                ingredients.length >= 3 ? ingredients.length - 3 : 0
              } thực phẩm khác`}
            </p>
            <p className="combo-price">
              {price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
          <div className="ingredients">
            <h2>Thành Phần</h2>
            {ingredients?.map((item, idx) => {
              const { name, quantity, unit } = item;
              return <IngredientBox key={idx} {...item} />;
            })}
          </div>
          <Guide steps={steps} />
          <Comment recipeId={recipeId} />
          <RecipeReview recipeId={recipeId} />
        </div>
      </div>
      <RecommendedRecipes productIds={productIds} />
      <TopItems />
      <Footer />
    </div>
    // </AppProvider>
  );
};

export default SingleDishPage;
